import { NextFunction, Request, Response } from 'express';
import { Obs } from '../middlewares/mqtt.middleware';

class ObsController {

  public getScenes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    Obs.getSceneList()
      .then((data) => {
        res.status(200).json({ data: data, message: 'sceneList' });
      })
      .catch((error) => {
        next(error);
      })
  }

  public setScene = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log('Switch to ' + req.body.name)
    Obs.setScene(req.body.name)
      .then((data) => {
        res.status(200).json({ data: data, message: 'setScene' });
      })
      .catch((error) => {
        next(error);
      })
  }
}

export default ObsController;
