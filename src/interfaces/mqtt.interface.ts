export enum enumMqttMessage {
    start,
    stop,
    lap
  }


export interface MqttMessage {
    message: enumMqttMessage;
  }