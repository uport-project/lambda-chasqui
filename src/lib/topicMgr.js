import { Client } from 'pg'
import { CREATE_QUERY, READ_QUERY, UPDATE_QUERY, DELETE_QUERY } from './queries.js'

/**
 * @classdesc
 * Main class for managing topics on the Chasqui service.  A topic is simply
 * an id with a message associated with it that supports CRUD operations,
 * each of which is implemented as an asynchronous method of this class.
 * 
 */
class TopicMgr {

    constructor() {
        this.pgUrl = null
        this.expiration = 86400
    }

    isSecretsSet() {
        return this.pgUrl !== null;
    }

    setSecrets(secrets) {
        this.pgUrl = secrets.PG_URL;
    }

    async create(topicId) {
        if (!topicId) throw ('no topicId')
        if (!this.pgUrl) throw ('no pgUrl set')

        const client = new Client({
            connectionString: this.pgUrl,
        })

        try {
            await client.connect()
            const res = await client.query(CREATE_QUERY, [topicId, this.expiration]);
            return res.rows[0];
        } catch (e) {
            throw (e);
        } finally {
            await client.end()
        }
    }

    async read(topicId) {
        if (!topicId) throw ('no topicId')
        if (!this.pgUrl) throw ('no pgUrl set')

        const client = new Client({
            connectionString: this.pgUrl,
        })

        try {
            await client.connect()
            const res = await client.query(READ_QUERY, [topicId]);
            return res.rows[0];
        } catch (e) {
            throw (e);
        } finally {
            await client.end()
        }
    }

    async update(topicId, content) {
        if (!topicId) throw ('no topicId')
        if (!content) throw ('no content')
        if (!this.pgUrl) throw ('no pgUrl set')

        const client = new Client({
            connectionString: this.pgUrl,
        })

        try {
            await client.connect()
            const res = await client.query(UPDATE_QUERY, [topicId, content]);
            return;
        } catch (e) {
            throw (e);
        } finally {
            await client.end()
        }
    }

    async delete(topicId) {
        if (!topicId) throw ('no topicId');
        if (!this.pgUrl) throw ('no pgUrl set')

        const client = new Client({
            connectionString: this.pgUrl,
        })

        try {
            await client.connect()
            const res = await client.query(DELETE_QUERY, [topicId])
            return;
        } catch (e) {
            throw (e);
        } finally {
            await client.end()
        }
    }
}

module.exports = TopicMgr
