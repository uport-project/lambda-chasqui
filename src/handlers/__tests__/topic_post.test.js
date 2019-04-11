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
            create: jest.fn(),
            update: jest.fn()
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

        test("no topic id", async () => {
            topicMgr.read.mockReturnValueOnce(null)
            await sut.handle({ pathParameters: {other: "thing"}, body: JSON.stringify(record)}, null, (err, res) => {
                expect(err).toBeNull()
                expect(res.code).toEqual(201)
                expect(res.body.message).toEqual('created')
                expect(res.headers.Location).toMatch(/^\/topic\/[a-zA-Z0-9_-]{16}/)
              });
        });

        test("happy path", async () => {
            topicMgr.read.mockReturnValueOnce(true)
            await sut.handle({ pathParameters: {id: newTopicId}, body: JSON.stringify(record)}, null, (err, res) => {
                expect(err).toBeNull();
                expect(res.body.message).toEqual('updated');
            });
        });
    });
});
