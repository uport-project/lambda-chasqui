const { randomString } = require('../lib/util.js')

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
            let topicId
            topicId = event.pathParameters.id
            try {
                await this.topicMgr.update(topicId, body)
                console.log("topic updated: " + topicId)
            } catch (error) {
                console.log("Error on this.topicMgr.update")
                console.log(error)
                cb({ code: 500, message: error.message })
                return
            }
            cb(null, { code: 200, data: { message: "updated" } });
            return;
        } else {
          // Create a new (unused) topic
          let topicId, topic
          do {
            topicId = randomString()
            topic = await this.topicMgr.read(topicId)
          } while (topic)
          topic = await this.topicMgr.create(topicId)
          console.log("topic created: " + topicId)
          cb(null, { code: 201, data: { message: "created" }, headers: {Location: `/topic/${topicId}`})
          return
        }

    }

}

module.exports = TopicPostHandler
