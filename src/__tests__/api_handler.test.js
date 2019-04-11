const AWS = require("aws-sdk");
const MockAWS = require ("aws-sdk-mock");
MockAWS.setSDKInstance(AWS);

const apiHandler = require('../api_handler');

describe('apiHandler', () => {

    beforeAll(() => {
        MockAWS.mock("KMS", "decrypt", Promise.resolve({Plaintext: "{}"}));
        process.env.SECRETS="fakesecrets";
    })

    test('topic_get()', done => {
        apiHandler.topic_get({},{},(err,res)=>{
            expect(err).toBeNull()
            expect(res).not.toBeNull()
            
            done();
        })
    });

    test('topic_post()', done => {
        apiHandler.topic_post({},{},(err,res)=>{
            expect(err).toBeNull()
            expect(res).not.toBeNull()
            
            done();
        })
    });

    test('topic_delete()', done => {
        apiHandler.topic_delete({},{},(err,res)=>{
            expect(err).toBeNull()
            expect(res).not.toBeNull()
            
            done();
        })
    });
    
    test('topic_get_legacy()', done => {
        apiHandler.topic_get_legacy({},{},(err,res)=>{
            expect(err).toBeNull()
            expect(res).not.toBeNull()
            
            done();
        })
    });


});
