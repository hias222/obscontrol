import ObsService from "../services/obs.service";
import { logger } from "../utils/logger";
import { enumMqttMessage, MqttMessage } from "../interfaces/mqtt.interface"

const Obs = new ObsService();

enum enumraceState {
  StartList = 'START',
  StartDelay = 'STARTDELAY',
  RaceRunning = 'RUNNING',
  RaceRunningDelay = 'RUNNINGDELAY',
  RaceFinish = 'FINISH',
  RaceEnd = 'END'
}


// StartList, StartDelay, RaceRunning, RaceRunningDelay, RaceFinish, RaceEnd
var raceState: string = enumraceState.StartList;
var obsState: string = enumraceState.StartList;

//var state: string = 'runnning'
var step: string = 'init'

const putRaceMessage = (mqttMessage: MqttMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    getRaceState(mqttMessage.message)
      .then((data) => {
        step = 'getRaceState'
        updateRaceState(data)
      })
      .then(() => {
        step = 'getSceneName'
        return getSceneName(raceState)
      })
      .then((data) => {
        step = 'checkTypeChange'
        return checkTypeChange(data)
      })
      .then((data) => {
        step = 'setScene'
        return Obs.setScene(data)
      })
      .then(() => {
        resolve('success scene')
      })
      .catch(() => {
        reject('error ' + step)
      })
  })
};

// StartList, StartDelay, RaceRunning, RaceRunningDelay, RaceFinish, RaceEnd

function getRaceState(message: enumMqttMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    switch (raceState) {
      case enumraceState.StartList:
        if (message === enumMqttMessage.start) resolve(enumraceState.RaceRunning)
        break;
      case enumraceState.RaceRunning:
        if (message === enumMqttMessage.stop) resolve(enumraceState.RaceEnd)
        break;
      case enumraceState.RaceEnd:
        if (message === enumMqttMessage.start) resolve(enumraceState.RaceRunning)
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
      case enumraceState.RaceRunning:
        if (typeof process.env.OBS_RACE_RUNNING === "undefined") {
          reject('not found')
        } else {
          resolve(process.env.OBS_RACE_RUNNING)
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

