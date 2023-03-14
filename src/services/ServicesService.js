import api from './../common/services/api.service';


/**
 * Services Service
 */
class ServicesService {

  /**
   * Load Services
   */
  async loadList(filter, offset) {
    try {
		 
        const data = await api.get('api/v1/service/' + filter, { limit: 12, offset: offset });
	     

	   
      return {
        entities: data.services || [],
        offset: data['load-next'] || '',
      };
    } catch (err) { 
		return {
			entities:  [],
			offset: '',
		  };
	}
  }

  /**
   * Load a service entity
   * @param {string} guid
   */
  loadEntity(guid) {
    return api.get('api/v1/service/'+guid);
  }

  
  upload(guid,  file) {
	  
    return api.upload('api/v1/service/${guid}', file);
  }

  save(guid, data) {
    return api.post('api/v1/service/${guid}', data);
  }

  saveAndUpload(file, data) {
     
	return  api.upload('api/v1/service/' ,file,data );
  }
  
}

export default new ServicesService();
