'use strict'
const AWS = require('aws-sdk');

const TopicMgr = require('./lib/topicMgr');

const TopicGetHandler = require('./api/topic_get');
const TopicPostHandler = require('./api/topic_post');
const TopicDeleteHandler = require('./api/topic_delete');

let topicMgr = new TopicMgr();

let topicGetHandler = new TopicGetHandler(topicMgr);
module.exports.topic_get = (event, context, callback) => { preHandler(topicGetHandler, event, context, callback) }

let topicPostHandler = new TopicPostHandler(topicMgr);
module.exports.topic_post = (event, context, callback) => { preHandler(topicPostHandler, event, context, callback) }

let topicDeleteHandler = new TopicDeleteHandler(topicMgr);
module.exports.topic_delete = (event, context, callback) => { preHandler(topicDeleteHandler, event, context, callback) }

const preHandler = (handler, event, context, callback) => {
    console.log(event)
    if (!topicMgr.isSecretsSet()) {
        const kms = new AWS.KMS();
        kms.decrypt({
            CiphertextBlob: Buffer(process.env.SECRETS, 'base64')
        }).promise().then(data => {
            const decrypted = String(data.Plaintext)
            topicMgr.setSecrets(JSON.parse(decrypted))
            doHandler(handler, event, context, callback)
        })
    } else {
        doHandler(handler, event, context, callback)
    }
}

const doHandler = (handler, event, context, callback) => {
    handler.handle(event, context, (err, resp) => {
        let response
        if (err == null) {
            let { code, headers, body } = resp
            response = {
                statusCode: code || 200,
                headers,
                body: JSON.stringify({
                    status: 'success',
                    ...body
                })
            }
        } else {
            //console.log(err);
            let code = 500;
            if (err.code) code = err.code;
            let message = err;
            if (err.message) message = err.message;

            response = {
                statusCode: code,
                body: JSON.stringify({
                    status: 'error',
                    message: message
                })
            }
        }

        callback(null, response)
    })

}
