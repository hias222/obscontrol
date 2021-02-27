import { Router } from 'express';
import ObsController from '../controllers/obs.controller';
import Route from '../interfaces/routes.interface';

class ObsRoute implements Route {
  public path = '/obs';
  public router = Router();
  public obsController;

  constructor() {
    this.obsController = new ObsController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.obsController.connect()
    .then(() => console.log('success obs '))
    .catch(() => console.log('failure obs'));
    this.router.get(`${this.path}`, this.obsController.getScenes);
    this.router.post(`${this.path}`, this.obsController.setScene);
  }
}

export default ObsRoute;
