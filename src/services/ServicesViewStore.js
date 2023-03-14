import { 
  observable,
  action,
  inject
} from 'mobx'
import ServicesService from './ServicesService';
import ServiceModel from './ServiceModel';
import UserModel from '../channel/UserModel';

/**
 * Services View Store
 */
class ServicesViewStore {

	data ={};

  @observable service = {};

  /**
   * Load service
   * @param {string} guid
   */
  @action
  loadService(guid) {
    return ServicesService.loadEntity(guid)
      .then(result => {
		this.data=  result;
        this.setService(result.service);
		//this.service.ownerObj = UserModel.checkOrCreate(service.ownerObj );
      });
  }
    
  /**
   * Set service
   * @param {object} service
   */
  @action
  setService(service) {
    this.service = ServiceModel.checkOrCreate(service);
	
	
  }
}

export default new ServicesViewStore();