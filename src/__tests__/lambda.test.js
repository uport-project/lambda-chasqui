/**
 * The closest thing to a full integration test that can be run locally.
 * aws-sdk and postgres are stubbed out, but the rest of the setup runs
 * the function from event object to response object, checking both success
 * and failure paths for the proper responses.
 */
const lambda = require('lambda-local')
const chasqui = require('../api_handler.js')

/**********************************************************************
 * Fairly involved mock setup: AWS is mocked with a special library,
 * and pg is mocked with jest as an in-memory js object.  Postgres 
 * queries are inferred from their first word.
 *********************************************************************/

const AWS = require('aws-sdk')
const MockAWS = require('aws-sdk-mock')
MockAWS.setSDKInstance(AWS);

// Create a mock postgres client which uses a js dict 
jest.mock('pg')
const pg = require('pg')
let db = {}
pg.Client = jest.fn().mockImplementation(() => ({
  connect: jest.fn(),
  end: jest.fn(),
  query: jest.fn((q, [id, content]) => {
    const firstWord = s => s.split(/\s+/)[1]
    switch (firstWord(q)) {
      case 'INSERT':
        if (id in db) throw Error('[INSERT] Already exists')
        else db[id] = ''
        return {rows: [db[id]]}
      case 'SELECT':
        return {rows: [db[id]]}
      case 'DELETE':
        if (id in db) delete db[id]
        else throw Error('[DELETE] doesn\'t exist')
        break
      case 'UPDATE':
        if (id in db) db[id] = content
        break 
      default:
        throw Error('Bad query: ', q)
    }
  })
}))

/** Setup functions for each request type using lambda-local */
const defaults = {
  lambdaFunc: chasqui, 
  callbackWaitsForEmptyEventLoop: true,
  timeoutMs: 3000,
}
const POST = (body, id) => lambda.execute(Object.assign({
  lambdaHandler: 'topic_post',
  event: { body: JSON.stringify(body), pathParameters: {id} },
}, defaults))

const GET = (id) => lambda.execute(Object.assign({
  lambdaHandler: 'topic_get',
  event: { pathParameters: {id} },
}, defaults))

const DELETE = (id) => lambda.execute(Object.assign({
  lambdaHandler: 'topic_delete',
  event: { pathParameters: {id} },
}, defaults))

/**********************************************************************
 * Actual tests here
 *********************************************************************/

beforeAll(() => {
  // Mock the aws key management and decrypting of the postgres url
  // Actual URL doesn't matter as we mock PG also
  MockAWS.mock("KMS", "decrypt", Promise.resolve({ Plaintext: '{"PG_URL": "fakeurl"}' }))
  process.env.SECRETS = "badSecret";
})

describe('success paths', () => {
  const content = {test: 'test'}

  test('POST /topic/ returns a new topic id in headers.location', (done) => {
    POST(content).then((response) => {
      expect(response.statusCode).toEqual(201)
      const { Location } = response.headers
      expect(Location).toMatch(/\/topic\/[a-zA-Z0-9-_]{16}/)
      expect(db[Location.replace('/topic/', '')]).toEqual(content)
      done()
    }).catch(e => {throw e})
  })

  test(`GET /topic/:id returns the posted content`, (done) => {
    let topicId = '0123456789abcdef'
    db[topicId] = content
    GET(topicId).then((response) => {
      expect(response.statusCode).toEqual(200)
      expect(JSON.parse(response.body).message).toEqual(content)
      done()
    })
  })

  test(`GET with unused id creates a new topic`, (done) => {
    let unused = 'unusedtopicid123'
    GET(unused).then(response => {
      expect(response.statusCode).toEqual(200)
      done()
    })
  })

  test(`DELETE /topic/:id`, (done) => {
    let topicId = 'beefbeefbeefbeef'
    db[topicId] = content
    DELETE(topicId).then((response) => {
      expect(response.statusCode).toEqual(200)
      expect(JSON.parse(response.body).status).toEqual('success')
      done()
    })
  })
})

describe('failure paths', () => {
  const unused = 'unusedtopicid123'
  beforeAll(() => {
    db = {}
  })

  test('GET without topicId returns 400', (done) => {
    GET('').then((response) => {
      expect(response.statusCode).toEqual(400)
      expect(JSON.parse(response.body).message).toEqual('No topic id')
      done()
    })
  })

  test('DELETE without topicId returns 400', (done) => {
    DELETE('').then((response) => {
      expect(response.statusCode).toEqual(400)
      expect(JSON.parse(response.body).message).toEqual('No topic id')
      done()
    })
  })

  // THIS IS NOT CURRENT BEHAVIOR.  COULD BE IN A FUTURE VERSION
  // test.skip('GET unused topicId returns 404', (done) => {
  //   GET(unused).then((response) => {
  //     expect(response.statusCode).toEqual(404)
  //     expect(JSON.parse(response.body).message).toEqual('topic not found')
  //     done()
  //   })
  // })

  test('POST unused topicId returns 404', (done) => {
    POST({test: 'test'}, unused).then(response => {
      expect(response.statusCode).toEqual(404)
      expect(db[unused]).toBe(undefined)
      done()
    })
  })

  test('DELETE unused topicId returns 404', (done) => {
    DELETE(unused).then((response) => {
      expect(response.statusCode).toEqual(404)
      expect(JSON.parse(response.body).message).toEqual('topic not found')
      done()
    })
  })
})