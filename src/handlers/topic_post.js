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
                const topic = await this.topicMgr.read(topicId)
                if (!topic) {
                  cb({ code: 404, message: 'topic not found' })
                  return
                }
                await this.topicMgr.update(topicId, body)
                console.log("topic updated: " + topicId)
            } catch (error) {
                console.log("Error on this.topicMgr.update")
                console.log(error)
                cb({ code: 500, message: error.message })
                return
            }
            cb(null, { code: 200, body: { message: "updated" } });
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
          // Set topic after creating new one
          await this.topicMgr.update(topicId, body)
          const retBody={
            message: "created",
            topicId: topicId
          }
          cb(null, { code: 201, body: retBody })
          return
        }

    }

}

module.exports = TopicPostHandler
