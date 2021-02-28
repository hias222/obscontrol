import OBSWebSocket from 'obs-websocket-js'
import { Scene } from '../interfaces/scene.interface'
import { logger } from '../utils/logger';

const obs = new OBSWebSocket();

class ObsService {

  public async getSceneList(): Promise<any> {

    var sceneList: Scene[] = [];

    return new Promise((resolve, reject) => {
      obs.connect()
        .then(() => {
          console.log(`Success! We're connected & authenticated.`);
          return obs.send('GetSceneList');
        })
        .then(data => {
          console.log(`${data.scenes.length} Available Scenes!`);
          data.scenes.forEach(scene => {
            const newScene: Scene = {
              name: scene.name
            }
            sceneList.push(newScene);
            //console.log(scene)
          });
          resolve(sceneList);
        })
        .then(() => {
          obs.disconnect()
          console.log('disconnect')
        })
        .catch((error) => {
          console.log('failure')
          return reject(error);
        })
    })
  }


  public setScene(sceneName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      obs.connect()
        .then(() =>
          obs.send('SetCurrentScene', {
            'scene-name': sceneName
          })
        )
        .then(() => obs.disconnect())
        .then(() => resolve('success'))
        .catch((error) => reject(error))
    })
  }
}

export default ObsService;