import ObsService from "../services/obs.service";

const Obs = new ObsService();
//Obs.connect();

const setScene = (type: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    Obs.setScene('cam');
    resolve('hello')

  })
};

export { setScene, Obs };

