
var mqtt = require('mqtt')

const mqtt_host = process.env.MQTT_URL || "mqtt://localhost"

var mqtt_username_local = typeof process.env.MQTT_USERNAME_LOCAL !== "undefined" ? process.env.MQTT_USERNAME_LOCAL : 'mqtt';
var mqtt_password_local = typeof process.env.MQTT_PASSWORD_LOCAL !== "undefined" ? process.env.MQTT_PASSWORD_LOCAL : 'mqtt';

var settings = {
    keepalive: 2000,
    username: mqtt_username_local,
    password: mqtt_password_local,
    clientId: 'display_' + Math.random().toString(16).substr(2, 8)
}

//var client = mqtt.connect(mqtt_host, settings)


export default class statusClient {

    client: any;

    constructor() {
        this.client = mqtt.connect(mqtt_host, settings)

        console.log('mqtt start')

        this.client.on('error', function (data) {
            console.log("error " + data);
        }
        )


        this.client.on('connect', function () {
            console.log("websocket backend connected");
            //client.subscribe(topic_name);
        });
    }







}