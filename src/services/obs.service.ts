import OBSWebSocket from 'obs-websocket-js'
import { Scene } from '../interfaces/scene.interface'
import { logger } from '../utils/logger';

const obs = new OBSWebSocket();

var obs_address = typeof process.env.OBS_ADDRESS !== "undefined" ? process.env.OBS_ADDRESS : 'localhost:4444';

class ObsService {

  public async getSceneList(): Promise<any> {

    var sceneList: Scene[] = [];

    return new Promise((resolve, reject) => {
      obs.connect({ address: obs_address })
        .then(() => {
          logger.info(`Success! We're connected & authenticated.`);
          return obs.send('GetSceneList');
        })
        .then(data => {
          //console.log(`${data.scenes.length} Available Scenes!`);
          data.scenes.forEach(scene => {
            const newScene: Scene = {
              name: scene.name
            }
            sceneList.push(newScene);
          });
          obs.disconnect()
          return resolve(sceneList);
        })
        .catch((error) => {
          console.log('error get scene list from ' + obs_address)
          return reject(error);
        })
    })
  }


  public setScene(sceneName: string): Promise<any> {
    //logger.info('setScene ' + sceneName)
    return new Promise((resolve, reject) => {
      obs.connect({ address: obs_address })
        .then(() => {
          logger.info('obs send ' + sceneName)
          return obs.send('SetCurrentScene', {
            'scene-name': sceneName
          })
        })
        .then(() => obs.disconnect())
        .then (() => resolve('send ' + sceneName + ' to obs ' + obs_address))
        .catch((error) => {
          logger.error('OBS switch to ' + sceneName + ' ' + error)
          return reject('switch to  ' + sceneName + ' failed - not exists? (obs ' + obs_address + ')')
        })
    })
  }
}

export default ObsService;