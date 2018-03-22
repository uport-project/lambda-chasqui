const TopicGetHandler = require("../topic_get");

describe("TopicGetHandler", () => {
  let sut;
  let topicMgr;
  let topicId = "faketopic";
  let newTopicId = "newtopic";
  let record = { topic: topicId, expiration: Date.now(), content: "fakecontent" };


  beforeAll(() => {
    topicMgr = {
      read: jest.fn(),
      create: jest.fn()
    };
    sut = new TopicGetHandler(topicMgr);
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  describe("handle", () => {
    test("no topic id", async () => {
      await sut.handle({}, {}, (err, res) => {
        expect(err).not.toBeNull();
        expect(err.code).toEqual(400);
        expect(err.message).toEqual("No topic id");
      });
    });

    test("happy path, new topic", async () => {
      topicMgr.read.mockReturnValue(null);
      topicMgr.create.mockReturnValue({
        id: newTopicId,
        content: ""
      });

      await sut.handle(
        { pathParameters: { id: newTopicId } },
        {},
        (err, res) => {
          expect(err).toBeNull();
          expect(res).toEqual({
            topic: {
              id: newTopicId,
              content: ""
            }
          });
        }
      );
    });

    test("happy path, topic existing", async () => {
      topicMgr.read.mockReturnValue(record);
      await sut.handle({ pathParameters: { id: topicId } }, {}, (err, res) => {
        expect(err).toBeNull();
        expect(res).toEqual({ topic: record });
      });
    });
  });
});
