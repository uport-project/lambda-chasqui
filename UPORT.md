
## uPort Flows

### Connect

The `uPort Connect` is the flow where the uPort Mobile App sends (disclose) the `uPortId` (and optional a topic to get two-way communication)


### Expected Usage

 1) `dApp` generates a random topic id `randomIdDapp` (ie: 1234-5678-9082)

 2) `dApp` show to the user a QR with callback: `/message/{randomId}`

 3) `dApp` suscribe to topic `randomId` , waits for `address` field.

 4) uPort Mobile app generates a `random topic id` (ie: 9923-1234-3234)

5) uPort Mobile app suscribe to topic `randomIdMobile`

6) uPort Mobile app scans URL from QR code

7) uPort do a POST to the URL `/message/{randomIdDapp}` (callback scanned URL) with `"address": "<address>"` and `"callback": "<randomIdMobile">` as body parameter

8) `dApp` app gets the `address` and the `callback` for the mobile app and delete the topic from the messaging server with `DELETE /topic/{randomId}`

### Suscription alternatives

To read messages for a topic there are several ways:

- **Polling:** Do `GET /topic/{topicId}` until a message has arrived
- **Push Notifications:** Register a PushNotification for a topic at `/push/{topicId}`
