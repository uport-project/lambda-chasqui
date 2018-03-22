
class TopicPostHandler {
    constructor(topicMgr) {
        this.topicMgr = topicMgr
    }

    async handle(event, context, cb) {

        //Parse body
        let body;
        try {
            body = JSON.parse(event.body)
        } catch (e) {
            cb({ code: 403, message: 'no json body'})
            return;
        }

        if (event.pathParameters && event.pathParameters.id) {
            let topicId;
            topicId = event.pathParameters.id
            try {
                await this.topicMgr.update(topicId, body)
                console.log("topic updated: " + topicId)
            } catch (error) {
                console.log("Error on this.topicMgr.update")
                console.log(error)
                cb({ code: 500, message: error.message })
                return;
            }
            cb(null, { message: "updated" });
            return;
        } else {
            cb({ code: 400, message: "No topic id" });
            return;
        }

    }

}

module.exports = TopicPostHandler
