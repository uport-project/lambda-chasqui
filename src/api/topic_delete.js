class TopicDeleteHandler {
    constructor(topicMgr) {
        this.topicMgr = topicMgr
    }

    async handle(event, context, cb) {

        if (event.pathParameters && event.pathParameters.id){
            let topicId;
            topicId = event.pathParameters.id
            try {
                let topic = await this.topicMgr.read(topicId)
                if (!topic) {
                  cb({ code: 404, message: 'topic not found'})
                  return
                }
                await this.topicMgr.delete(topicId)
                console.log("topic deleted: " + topicId)
            } catch (error) {
                console.log("Error on this.topicMgr.delete")
                console.log(error)
                cb({ code: 500, message: error.message })
                return;
            }
            cb(null)
            return;
        } else {
          cb({ code: 400, message: "No topic id"});
          return;
        }

    }


}

module.exports = TopicDeleteHandler
