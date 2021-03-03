import { putRaceMessage } from "../middlewares/mqtt.middleware";
import { enumMqttMessage, MqttMessage } from "../interfaces/mqtt.interface"
import { logger } from "../utils/logger";

var mqtt = require('mqtt')

const mqtt_host = process.env.MQTT_URL || "mqtt://localhost"

var mqtt_username_local = typeof process.env.MQTT_USERNAME_LOCAL !== "undefined" ? process.env.MQTT_USERNAME_LOCAL : 'mqtt';
var mqtt_password_local = typeof process.env.MQTT_PASSWORD_LOCAL !== "undefined" ? process.env.MQTT_PASSWORD_LOCAL : 'mqtt';

const topic_name = "mainchannel"

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
            var messagetype : string =jsonmessage.type
            //todo switch on string to enum
            var test: MqttMessage = {
                message: enumMqttMessage.start
            }
            resolve(test)
        } catch (e) {
            reject('error')
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
                .then((mqttMsg) => putRaceMessage(mqttMsg))
                .catch((error) => 
                logger.error('failed message analyse on mqtt topic ' + topic + " " + message + " " + error )
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