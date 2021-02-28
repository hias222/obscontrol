import ObsService from "../services/obs.service";

const Obs = new ObsService();

var state: string = 'runnning'
var step: string = 'start'

const setScene = (message: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    getMessageType(message)
      .then((data) => {
        step = 'getSceneName'
        return getSceneName(data)
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
        console.log('switch to ' + state)
        resolve('success scene')
      })
      .catch(() => {
        reject('error ' + step)
      })
  })
};

function getMessageType(message: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      var jsonmessage = JSON.parse(message)
      resolve(jsonmessage.type)
    } catch (e) {
      reject('error')
    }
  })
}

function checkTypeChange(status: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (status !== state) {
      state = status;
      resolve(status)
    } else {
      reject('no change')
    }
  })
}

function getSceneName(status: string): Promise<string> {
  return new Promise((resolve, reject) => {
    switch (status.toLowerCase()) {
      case 'header':
        if (typeof process.env.OBS_HEADER_SCENE === "undefined") {
          reject('not found')
        } else {
          resolve(process.env.OBS_HEADER_SCENE)
        }
        break;
      case 'start':
        if (typeof process.env.OBS_START_SCENE === "undefined") {
          reject('not found')
        } else {
          resolve(process.env.OBS_START_SCENE)
        }
        break;
      default:
        reject('not found')
        break;
    }
  })
}


export { setScene, Obs };

