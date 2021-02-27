import { Router } from 'express';
import ObsController from '../controllers/obs.controller';
import Route from '../interfaces/routes.interface';

class ObsRoute implements Route {
  public path = '/obs';
  public router = Router();
  public obsController = new ObsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.obsController.getScenes);
  }
}

export default ObsRoute;
