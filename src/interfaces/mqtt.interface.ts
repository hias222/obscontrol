export enum enumMqttMessage {
    start,
    stop,
    lap,
    finish,
    newheader
  }


export interface MqttMessage {
    message: enumMqttMessage;
  }