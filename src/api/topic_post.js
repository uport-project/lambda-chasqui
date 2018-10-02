
class TopicPostHandler {
    constructor(topicMgr) {
        this.topicMgr = topicMgr
    }

    /**
     * Handle a post request for a given topic ID, by creating one if none
     * exists, or updating an existing topic.  Respond by calling cb with 
     * message 'created' or 'updated' as appropriate
     * @param {Object} event 
     * @param {Object} context 
     * @param {Function} cb 
     */
    async handle(event, context, cb) {
        // Parse body
        let body
        try {
            body = JSON.parse(event.body)
        } catch (e) {
            cb({ code: 403, message: 'no json body'})
            return
        }

        if (event.pathParameters && event.pathParameters.id) {
            let topicId, message = 'updated'
            topicId = event.pathParameters.id
            try {
                // First check for existing topic
                let topic = await this.topicMgr.read(topicId)
                if (!topic) {
                  // Create topic if none exists, and set response message to 'created'
                  message = 'created'
                  topic = await this.topicMgr.create(topicId)
                  console.log("topic created: " + topicId)
                }
                await this.topicMgr.update(topicId, body)
                console.log("topic updated: " + topicId)
            } catch (error) {
                console.log("Error on this.topicMgr.update")
                console.log(error)
                cb({ code: 500, message: error.message })
                return
            }
            cb(null, { message })
            return
        } else {
            cb({ code: 400, message: "No topic id" })
            return
        }
    }
}

module.exports = TopicPostHandler
