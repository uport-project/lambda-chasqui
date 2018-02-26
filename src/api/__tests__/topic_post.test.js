const TopicPostHandler = require("../topic_post");

describe("TopicPostHandler", () => {
    let sut;
    let topicMgr;
    let topicId = "faketopic";
    let newTopicId = "newtopic";
    let record = {
        topic: topicId,
        expiration: Date.now(),
        content: "fakecontent"
    };

    beforeAll(() => {
        topicMgr = {
            read: jest.fn(),
            create: jest.fn()
        };
        sut = new TopicPostHandler(topicMgr);
    });

    test("empty constructor", () => {
        expect(sut).not.toBeUndefined();
    });

    describe("handle", () => {

        test("no json body", async () => {
            await sut.handle(undefined, null, (err, res) => {
                expect(err).not.toBeNull();
                expect(err.code).toEqual(403);
                expect(err.message).toEqual("no json body");
            });
        });

        test.skip("no topic id", async () => {
          await sut.handle({pathParameters: {other: "thing"}}, record, (err, res) => {
            expect(err).not.toBeNull();
            expect(err.code).toEqual(400);
            expect(err.message).toEqual("no topic id");
          });
        });

        test.skip("happy path", async () => {
        });

    });
});
