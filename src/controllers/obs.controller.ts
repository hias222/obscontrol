import { NextFunction, Request, Response } from 'express';
import { Obs } from '../middlewares/mqtt.middleware';

class ObsController {

  public getScenes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    Obs.getSceneList()
      .then((data) => {
        res.status(200).json({ data: data, message: 'sceneList' });
      })
      .catch((error) => {
        next({ status: 400, message: error});
      })
  }

  public setScene = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    Obs.setScene(req.body.name)
      .then((data) => {
        return res.status(200).json({ data: data, message: 'setScene' });
      })
      .catch((error) => {
        next({ status: 400, message: error});
      })
  }
}

export default ObsController;
