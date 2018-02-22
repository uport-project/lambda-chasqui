import { Client } from 'pg'


class TopicMgr {

    constructor() {
        this.pgUrl = null
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
            const res = await client.query(
                "INSERT INTO topics(id) \
             VALUES ($1);"
                , [topicId]);
            return;
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
            //TODO: query
        } catch (e) {
            throw (e);
        } finally {
            await client.end()
        }
    }

    async delete(address, networkName) {
        if (!this.pgUrl) throw ('no pgUrl set')

        const client = new Client({
            connectionString: this.pgUrl,
        })

        try {
            await client.connect()
            //TODO: query
        } catch (e) {
            throw (e);
        } finally {
            await client.end()
        }
    }


}

module.exports = TopicMgr
