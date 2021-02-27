import { NextFunction, Request, Response } from 'express';
import obsService from '../services/obs.service';

class ObsController {
  public obsService = new obsService();

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
