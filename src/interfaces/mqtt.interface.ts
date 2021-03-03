export enum enumMqttMessage {
    start,
    stop,
    lap,
    finish
  }


export interface MqttMessage {
    message: enumMqttMessage;
  }