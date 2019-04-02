class TopicGetHandler {
    constructor(topicMgr) {
        this.topicMgr = topicMgr
    }

    async handle(event, context, cb) {
        if (event.pathParameters && event.pathParameters.id) {
            let topicId;
            let topic;
            topicId = event.pathParameters.id
            try {
                topic = await this.topicMgr.read(topicId)
                if (!topic){
                    await this.topicMgr.create(topicId)
                    console.log("topic created: " + topicId);
                    topic={};
                }
            } catch (error) {
                console.log("Error on this.topicMgr.create")
                console.log(error)
                cb({ code: 500, message: error.message })
                return;
            }
            cb(null, { body: { message: topic } })
            return;
        } else {
            cb({ code: 400, message: "No topic id" });
            return;
        }

    }


}

module.exports = TopicGetHandler
