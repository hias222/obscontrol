import OBSWebSocket from 'obs-websocket-js'
import { Scene } from '../interfaces/scene.interface'

class ObsService {
  public obs = new OBSWebSocket();

  constructor() {
    this.obs.connect()
      .then(() => {
        console.log(`OBS Success! We're connected & authenticated.`);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  public async getSceneList(): Promise<any> {

    var sceneList: Scene[] = [];

    return new Promise((resolve, reject) => {
      this.obs.send('GetSceneList')
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
        .then(() =>
          console.log('finished scene')
        )
        .catch((error) => {
          console.log(error)
          return reject(error);
        })
    })
  }


  public setScene(sceneName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.obs.send('SetCurrentScene', {
        'scene-name': sceneName
      })
      .then(() => resolve('success'))
      .catch((error) => {
        return reject(error)
      })
    })

  }
}

export default ObsService;