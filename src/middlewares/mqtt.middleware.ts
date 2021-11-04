import ObsService from "../services/obs.service";
import { logger } from "../utils/logger";
import { enumMqttMessage, MqttMessage } from "../interfaces/mqtt.interface"

const Obs = new ObsService();

enum enumraceState {
  StartList = 'START',
  PoolList = 'POOL',
  RaceBeginning = 'BEGIN',
  RaceRunning = 'RUNNING',
  RaceFinish = 'FINISH',
  RaceEnd = 'END'
}


// StartList, StartDelay, RaceRunning, RaceRunningDelay, RaceFinish, RaceEnd
var raceState: string = enumraceState.StartList;
var obsState: string = enumraceState.StartList;

//var state: string = 'runnning'
var step: string = 'init'

const putRaceMessage = (mqttMessage: MqttMessage): Promise<any> => {
  //console.log(mqttMessage.message)
  return new Promise((resolve, reject) => {
    getRaceState(mqttMessage.message)
      .then((data) => {
        //console.log(' xxx- ' + data)
        step = 'getRaceState'
        updateRaceState(data)
      })
      .then(() => {
        step = 'getSceneName'
        return getSceneName(raceState)
      })
      .then((data) => {
        step = 'checkTypeChange'
        setTimeout(function () {
          delayForSwitch(mqttMessage.message);
        }, 5000);
        return checkTypeChange(data)
      })
      .then((data) => {
        step = 'setScene'
        return Obs.setScene(data)
      })
      .then(() => {
        resolve('success scene')
      })
      .catch((data) => {
        logger.info('exit at ' + step + " with " + data)
        resolve('end')
        // we goit an error on exit - node crashes
        //reject('error')
      })
  })
};

function delayForSwitch(message: enumMqttMessage) {
  if (message === enumMqttMessage.newheader) {
    var mqttMessage1: MqttMessage = {
      message: enumMqttMessage.newHeaderdelay
    }
    putRaceMessage(mqttMessage1)
  }
  
  if (message === enumMqttMessage.start) {
    var mqttMessage2: MqttMessage = {
      message: enumMqttMessage.startdelay
    }
    putRaceMessage(mqttMessage2)
  }
  
}


// StartList, StartDelay, RaceRunning, RaceRunningDelay, RaceFinish, RaceEnd

function getRaceState(message: enumMqttMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    //console.log(raceState + ' - ' + message)
    switch (raceState) {
      case enumraceState.StartList:
        //refresh on new header
        if (message === enumMqttMessage.newheader) resolve(enumraceState.StartList)
        if (message === enumMqttMessage.start) resolve(enumraceState.RaceBeginning)
        if (message === enumMqttMessage.newHeaderdelay) resolve(enumraceState.PoolList)
        if (message === enumMqttMessage.finish) resolve(enumraceState.RaceFinish)
        break;
      case enumraceState.PoolList:
        if (message === enumMqttMessage.start) resolve(enumraceState.RaceBeginning)
        if (message === enumMqttMessage.finish) resolve(enumraceState.RaceFinish)
        if (message === enumMqttMessage.stop) resolve(enumraceState.StartList)
        if (message === enumMqttMessage.newheader) resolve(enumraceState.StartList)
        break;
      case enumraceState.RaceBeginning:
        if (message === enumMqttMessage.startdelay) resolve(enumraceState.RaceRunning)
        if (message === enumMqttMessage.finish) resolve(enumraceState.RaceFinish)
        if (message === enumMqttMessage.stop) resolve(enumraceState.PoolList)
        if (message === enumMqttMessage.newheader) resolve(enumraceState.StartList)
        break;
      case enumraceState.RaceRunning:
        if (message === enumMqttMessage.finish) resolve(enumraceState.RaceFinish)
        if (message === enumMqttMessage.stop) resolve(enumraceState.PoolList)
        if (message === enumMqttMessage.newheader) resolve(enumraceState.StartList)
        break;
      case enumraceState.RaceFinish:
        if (message === enumMqttMessage.start) resolve(enumraceState.RaceRunning)
        if (message === enumMqttMessage.stop) resolve(enumraceState.RaceEnd)
        if (message === enumMqttMessage.newheader) resolve(enumraceState.StartList)
        break;
      case enumraceState.RaceEnd:
        if (message === enumMqttMessage.start) resolve(enumraceState.RaceBeginning)
        if (message === enumMqttMessage.newheader) resolve(enumraceState.StartList)
        break;
      default:
        logger.error('getRaceState not found message')
        reject('not found')
        break;
    }

  })
}


function updateRaceState(newraceState: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (newraceState !== undefined) {
      if (newraceState !== raceState) {
        raceState = newraceState
        logger.info('raceState is ' + newraceState)
      }
      resolve(newraceState)
    } else {
      reject('undefined')
    }

  })
}

function checkTypeChange(status: string): Promise<string> {
  return new Promise((resolve, reject) => {
    
    if (status !== obsState) {
      obsState = status;
      resolve(status)
    } else {
      reject('no change')
    }
  })
}

function getSceneName(state: string): Promise<string> {
  return new Promise((resolve, reject) => {
    switch (state) {
      case enumraceState.StartList:
        if (typeof process.env.OBS_START_LIST === "undefined") {
          reject('not found')
        } else {
          resolve(process.env.OBS_START_LIST)
        }
        break;
      case enumraceState.PoolList:
        if (typeof process.env.OBS_POOL_LIST === "undefined") {
          reject('not found')
        } else {
          resolve(process.env.OBS_POOL_LIST)
        }
        break;
      case enumraceState.RaceBeginning:
        if (typeof process.env.OBS_RACE_BEGINNING === "undefined") {
          reject('not found')
        } else {
          resolve(process.env.OBS_RACE_BEGINNING)
        }
        break;
      case enumraceState.RaceRunning:
        if (typeof process.env.OBS_RACE_RUNNING === "undefined") {
          reject('not found')
        } else {
          resolve(process.env.OBS_RACE_RUNNING)
        }
        break;
      case enumraceState.RaceFinish:
        if (typeof process.env.OBS_RACE_FINISH === "undefined") {
          reject('not found')
        } else {
          resolve(process.env.OBS_RACE_FINISH)
        }
        break;
      case enumraceState.RaceEnd:
        if (typeof process.env.OBS_RACE_END === "undefined") {
          reject('not found')
        } else {
          resolve(process.env.OBS_RACE_END)
        }
        break;
      default:
        reject('not found')
        break;
    }
  })
}


export { putRaceMessage, Obs };

