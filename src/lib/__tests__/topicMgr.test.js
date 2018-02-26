jest.mock("pg");
import { Client } from "pg";
let pgClientMock = {
  connect: jest.fn(),
  end: jest.fn()
};
Client.mockImplementation(() => {
  return pgClientMock;
});
const TopicMgr = require("../topicMgr");

describe("TopicMgr", () => {
    let sut;
    let fakeTopicId = "fakeTopic";
    let content = "topic content"
    let expiration = 60;

    beforeAll(() => {
        sut = new TopicMgr();
    });

    test("empty constructor", () => {
        expect(sut).not.toBeUndefined();
    });

    test("is isSecretsSet", () => {
        let secretSet = sut.isSecretsSet();
        expect(secretSet).toEqual(false);
    });

    test("setSecrets", () => {
        expect(sut.isSecretsSet()).toEqual(false);
        sut.setSecrets({ PG_URL: "fakepg" });
        expect(sut.isSecretsSet()).toEqual(true);
    });

    test("create() no topicId ", done => {
      sut
        .create()
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no topicId");
          done();
        });
    });

    test("create() happy path", done => {

        pgClientMock.connect=jest.fn()
        pgClientMock.connect.mockClear()
        pgClientMock.end.mockClear()
        pgClientMock.query=jest.fn(()=>{
        return Promise.resolve({
            rows:[{
                topic: fakeTopicId
            }]
        })})

        sut.create(fakeTopicId)
        .then(resp => {
            expect(pgClientMock.connect).toBeCalled()
            expect(pgClientMock.query).toBeCalled()
            expect(pgClientMock.query).toBeCalledWith(
                "INSERT INTO topics(id, expiration) \
             VALUES ($1, now() + interval '$2' second);"
             , [fakeTopicId, expiration]);
            expect(pgClientMock.end).toBeCalled()
            expect(resp.topic).toEqual("fakeTopic")
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });

    test("read() no topicId ", done => {
        sut
        .read()
        .then(resp => {
            fail("shouldn't return");
            done();
        })
        .catch(err => {
            expect(err).toEqual("no topicId");
            done();
        });
    });

    test("read() happy path", done => {
        let fakeResponse = {
            topic: fakeTopicId,
            expiration: Date.now(),
            content: "fakecontent"
        }
        pgClientMock.connect = jest.fn();
        pgClientMock.connect.mockClear();
        pgClientMock.end.mockClear();
        pgClientMock.query = jest.fn(() => {
            return Promise.resolve({ rows: [fakeResponse]});
        });

        sut.read(fakeTopicId)
        .then(resp => {
            expect(pgClientMock.connect).toBeCalled();
            expect(pgClientMock.query).toBeCalled();
            expect(pgClientMock.query).toBeCalledWith(
                "SELECT * FROM topics \
                    WHERE id=$1 \
                    AND expiration > now()", [fakeTopicId]);
            expect(pgClientMock.end).toBeCalled();
            expect(resp).toEqual(fakeResponse);
            done();
        })
        .catch(err => {
            fail(err);
            done();
        });
    });

    test("update() no topicId ", done => {
        sut
        .update()
        .then(resp => {
            fail("shouldn't return");
            done();
        })
        .catch(err => {
            expect(err).toEqual("no topicId");
            done();
        });
    });

    test("update() no content ", done => {
        sut
        .update(fakeTopicId)
        .then(resp => {
            fail("shouldn't return");
            done();
        })
        .catch(err => {
            expect(err).toEqual("no content");
            done();
        });
    });

    test("update() happy path", done => {
      let fakeResponse = { topic: fakeTopicId, expiration: Date.now(), content: "fakecontent" };
      pgClientMock.connect = jest.fn();
      pgClientMock.connect.mockClear();
      pgClientMock.end.mockClear();
      pgClientMock.query = jest.fn(() => {
        return Promise.resolve({ rows: "ok" });
      });

      sut
        .update(fakeTopicId, content)
        .then(resp => {
          expect(pgClientMock.connect).toBeCalled();
          expect(pgClientMock.query).toBeCalled();
          expect(pgClientMock.query).toBeCalledWith(
                "UPDATE topics SET \
                content = $2 WHERE \
                id = $1;"
                , [fakeTopicId, content]);
          expect(pgClientMock.end).toBeCalled();
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });


    test("delete() no topicId ", done => {
        sut
        .delete()
        .then(resp => {
            fail("shouldn't return");
            done();
        })
        .catch(err => {
            expect(err).toEqual("no topicId");
            done();
        });
    });

        test("delete() happy path", done => {
          let fakeResponse = { topic: fakeTopicId, expiration: Date.now(), content: "fakecontent" };
          pgClientMock.connect = jest.fn();
          pgClientMock.connect.mockClear();
          pgClientMock.end.mockClear();
          pgClientMock.query = jest.fn(() => {
            return Promise.resolve({ rows: "ok" });
          });

          sut
            .delete(fakeTopicId)
            .then(resp => {
              expect(pgClientMock.connect).toBeCalled();
              expect(pgClientMock.query).toBeCalled();
              expect(pgClientMock.query).toBeCalledWith(
                "DELETE FROM topics \
                WHERE id = $1;"
                , [fakeTopicId]);
              expect(pgClientMock.end).toBeCalled();
              done();
            })
            .catch(err => {
              fail(err);
              done();
            });
        });



});
