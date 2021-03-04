export enum enumMqttMessage {
    start = 'M_START',
    stop = 'M_STOP',
    lap = 'M_LAP',
    finish = 'M_FINISH',
    newheader = 'M_NEWHEADER',
    newHeaderdelay ='M_NEWHEADERDELAY',
    startdelay = 'M_SARTDELAY'
  }


export interface MqttMessage {
    message: enumMqttMessage;
  }