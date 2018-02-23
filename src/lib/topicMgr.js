import { Client } from 'pg'


class TopicMgr {

    constructor() {
        this.pgUrl = null
        this.expiration = 60
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
                "INSERT INTO topics(id, expiration) \
             VALUES ($1, now() + interval '$2' second);"
                , [topicId, this.expiration]);
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
            const res = await client.query(
                "UPDATE topics SET \
                content = $2 WHERE \
                id = $1;"
                , [topicId, content]);
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
            const res = await client.query(
                "DELETE FROM topics \
                WHERE id = $1;"
                , [topicId]);
            return;

        } catch (e) {
            throw (e);
        } finally {
            await client.end()
        }
    }


}

module.exports = TopicMgr
