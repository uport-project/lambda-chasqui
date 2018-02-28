# lambda-chasqui
 🏃 Messenger service 🏃

_(Quechua) The chasquis were the messengers of the Inca empire_

## Description
Chasqui is a server that allows communication between dApps, mobile apps (like uPort Mobile) and servers

## Diagrams

See [Diagrams](./diagrams/README.md) page.

## API Description

### Topics and Subscriptions
Chasqui can be used to send information from one point to another, this is done through _topics_. The recepient sets a new topic on chasqui, communicate the topic to the sender and suscribe to the _topic_. The sender can send data (json objects) to the _topic_ and chasqui will relay the data to the suscribers of that _topic_.

In uPort this is used to send the uPortId from the mobile app to the dApp (running in a browser). This flow is known as [uPort Connect](UPORT.md#Connect). It is also used for requesting transaction signing when no two-way communication between the dApp and the mobile app is set. This flow is known as [uPort Sign](UPORT.md#Sign)

#### Endpoint

`GET /topic/:id`

#### Response

| Status |     Message    |                               |
|:------:|----------------|-------------------------------|
| 200    | Ok.            | Message stored on topic <id>  |
| 500    | Internal Error | Internal error                |

#### Response data
```
{
  status: 'success',
  message: {}
}
```

#### Endpoint

`POST /topic/:id`

#### Body

(any json)

#### Response

| Status |     Message    |                                            |
|:------:|----------------|--------------------------------------------|
| 200    | Ok.            | Topic updated                              |
| 404    | Not found      | Topic not found                            |
| 500    | Internal Error | Internal Error                             |


#### Response data
```
{
  status: 'success',
  message: 'updated'
}
```

#### Endpoint

`DELETE /topic/:id`

#### Response

| Status |     Message    |                                            |
|:------:|----------------|--------------------------------------------|
| 200    | Ok.            | Topic deleted                              |
| 404    | Not found      | Topic not found                            |
| 500    | Internal Error | Internal Error                             |


#### Response data
```
{
  status: 'success',
  message: 'deleted'
}
```