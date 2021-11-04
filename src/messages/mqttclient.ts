import { putRaceMessage } from "../middlewares/mqtt.middleware";
import { enumMqttMessage, MqttMessage } from "../interfaces/mqtt.interface"
import { logger } from "../utils/logger";

var mqtt = require('mqtt')

const mqtt_host = process.env.MQTT_URL || "mqtt://localhost"

var mqtt_username_local = typeof process.env.MQTT_USERNAME_LOCAL !== "undefined" ? process.env.MQTT_USERNAME_LOCAL : 'mqtt';
var mqtt_password_local = typeof process.env.MQTT_PASSWORD_LOCAL !== "undefined" ? process.env.MQTT_PASSWORD_LOCAL : 'mqtt';

const topic_name = "mainchannel"

var actualHeat = '0'
var actualEvent = '0'

var settings = {
    keepalive: 2000,
    username: mqtt_username_local,
    password: mqtt_password_local,
    clientId: 'display_' + Math.random().toString(16).substr(2, 8)
}

function getMessageType(message: string): Promise<MqttMessage> {
    return new Promise((resolve, reject) => {
        try {
            var jsonmessage = JSON.parse(message)
            var messagetype: string = jsonmessage.type
            //console.log(jsonmessage)
            getMqttMessage(messagetype, jsonmessage)
                .then((msg) => resolve(msg))
                .catch(() => reject)
        } catch (e) {
            reject('error')
        }
    })
}


function getMqttMessage(messagetype: string, jsonmessage: any): Promise<MqttMessage> {
    return new Promise((resolve, reject) => {
        switch (messagetype) {
            case 'start':
                var mqttMessage: MqttMessage = {
                    message: enumMqttMessage.start
                }
                resolve(mqttMessage)
                break;
            case 'stop':
                var mqttMessage: MqttMessage = {
                    message: enumMqttMessage.stop
                }
                resolve(mqttMessage)
                break;
            case 'lane':
                if (jsonmessage.place !== 'undefined' && jsonmessage.place !== '0') {
                    var mqttMessage: MqttMessage = {
                        message: enumMqttMessage.finish
                    }
                    resolve(mqttMessage)
                } else {
                    var mqttMessage: MqttMessage = {
                        message: enumMqttMessage.lap
                    }
                    resolve(mqttMessage)
                }
                break;
            case 'header':
                if (jsonmessage.event !== actualEvent || jsonmessage.heat !== actualHeat) {
                    console.log('get new ' + jsonmessage.event + ' - ' + jsonmessage.heat)
                    actualEvent = jsonmessage.event
                    actualHeat = jsonmessage.heat
                    var mqttMessage: MqttMessage = {
                        message: enumMqttMessage.newheader
                    }
                    resolve(mqttMessage)
                } else {
                    reject
                }
                break;
            default:
                reject
                break;
        }
    })
}


export default class statusClient {

    connect() {
        var client = mqtt.connect(mqtt_host, settings)
        console.log('mqtt start')

        client.on('error', function (data) {
            console.log("error " + data);
        })

        client.on('connect', function () {
            console.log("websocket backend connected - sub to " + topic_name);
            client.subscribe(topic_name, function (err) {
                if (err) {
                    console.log(err)
                }
            })
        });

        client.on('error', function (error) {
            console.log("websocket backend error");
            console.log(error);
            client.subscribe(topic_name);
        });

        client.on('message', function (topic, message) {
            getMessageType(message)
                .then((mqttMsg) => {
                    //logger.info('put ' + mqttMsg.message)
                    return putRaceMessage(mqttMsg)
                })
                .finally(() =>
                    logger.info('message succeded ')
                )
                .catch((error) =>
                    logger.info('discard msg ' + error)
                    //logger.error('failed message analyse on mqtt topic ' + topic + " " + message + " " + error)
                )
        });

        /*

this.client.on('disconnect', function () {
    console.log("websocket backend disconnected");
    this.client = mqtt.connect(mqtt_host, settings);
});
*/

    }

}