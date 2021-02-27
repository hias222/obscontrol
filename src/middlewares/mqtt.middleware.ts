import ObsService from "../services/obs.service";

const Obs = new ObsService();
Obs.connect();

const mqttMiddleware = (type: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    Obs.setScene('cam');  
    resolve('hello')

  })
};

export default mqttMiddleware;
