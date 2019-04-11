class TopicGetLegacyHandler {
    constructor(topicMgr) {
        this.topicMgr = topicMgr
    }

    async handle(event, context, cb) {
        if (event.pathParameters && event.pathParameters.id) {
            let topicId;
            let topic;
            topicId = event.pathParameters.id
            console.log("topicId: "+topicId)
            try {
                topic = await this.topicMgr.read(topicId)
                console.log("topic(post read): "+JSON.stringify(topic))
                if (!topic){
                    await this.topicMgr.create(topicId)
                    console.log("topic created: " + topicId);
                    topic={};
                }else{
                    if(topic.content==null) topic={}
                    else{
                        topic=JSON.parse(topic.content)
                    }
                }
            } catch (error) {
                console.log("Error on this.topicMgr.create")
                console.log(error)
                cb({ code: 500, message: error.message })
                return;
            }
            console.log("topic: "+JSON.stringify(topic))
            cb(null, { body: { message: topic } })
            return;
        } else {
            cb({ code: 400, message: "No topic id" });
            return;
        }

    }


}

module.exports = TopicGetLegacyHandler
