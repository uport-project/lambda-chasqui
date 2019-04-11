"use strict";
const createJsendHandler = require("./lib/jsend");
const createSecretsWrappedHandler = require("./lib/secrets_wrapper");

//Load Mgrs
const TopicMgr = require('./lib/topicMgr')

//Instanciate Mgr
let topicMgr = new TopicMgr()

//Mgr that needs secrets handling
const secretsMgrArr=[topicMgr];

//Load handlers
const TopicGetHandler = require('./handlers/topic_get')
const TopicGetLegacyHandler = require('./handlers/topic_get_legacy')
const TopicPostHandler = require('./handlers/topic_post')
const TopicDeleteHandler = require('./handlers/topic_delete')

//Instanciate handlers
const topicGetHandler = createJsendHandler(new TopicGetHandler(topicMgr));
const topicGetLegacyHandler = createJsendHandler(new TopicGetLegacyHandler(topicMgr));
const topicPostHandler = createJsendHandler(new TopicPostHandler(topicMgr));
const topicDeleteHandler = createJsendHandler(new TopicDeleteHandler(topicMgr));

//Exports for serverless
exports.topic_get   = createSecretsWrappedHandler(secretsMgrArr,topicGetHandler);
exports.topic_get_legacy = createSecretsWrappedHandler(secretsMgrArr,topicGetLegacyHandler);
exports.topic_post = createSecretsWrappedHandler(secretsMgrArr,topicPostHandler);
exports.topic_delete = createSecretsWrappedHandler(secretsMgrArr,topicDeleteHandler);
