import { NextFunction, Request, Response } from 'express';
import obsService from '../services/obs.service';

class ObsController {
  public obsService;

  constructor() {
    this.obsService = new obsService();
  }

  public connect(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.obsService.connect()
        .then(() => {
          console.log(`OBS Success! We're connected & authenticated.`);
          return resolve
        })
        .catch((error) => {
          console.log('ObsController connect failed!!');
          return reject(error)
        })
    })
  }

  public getScenes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.obsService.getSceneList()
      .then((data) => {
        res.status(200).json({ data: data, message: 'sceneList' });
      })
      .catch((error) => {
        next(error);
      })
  }

  public setScene = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log('Switch to ' + req.body.name)
    this.obsService.setScene(req.body.name)
      .then((data) => {
        res.status(200).json({ data: data, message: 'setScene' });
      })
      .catch((error) => {
        next(error);
      })
  }
}

export default ObsController;
