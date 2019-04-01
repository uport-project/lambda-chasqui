const TopicDeleteHandler = require("../topic_delete");

describe("TopicDeleteHandler", () => {
    let sut;
    let topicMgr;
    let topicId = "faketopic"

    beforeAll(() => {
        topicMgr = {
            delete: jest.fn(),
            read: jest.fn().mockReturnValue(true),
        };
        sut = new TopicDeleteHandler(topicMgr);
    });


    test("empty constructor", () => {
        expect(sut).not.toBeUndefined();
    });

    describe("handle", () => {

        test("no topic id", async () => {
            await sut.handle({},{},(err, res) => {
                expect(err).not.toBeNull();
                expect(err.code).toEqual(400);
                expect(err.message).toEqual("No topic id");
            });
        });

        test("happy path", async () => {
            topicMgr.delete.mockReturnValue("ok");

            await sut.handle({pathParameters: {id: topicId }}, {}, (err, res) => {
                expect(err).toBeNull();
            });
        });

    });

});
