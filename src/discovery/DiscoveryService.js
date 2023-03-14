import api from './../common/services/api.service';

/**
 * Discovery Service
 */
class DiscoveryService {

  controller = null

  async search({ offset, type, filter, q }) {

    let endpoint = 'api/v2/search',
      params = {
        q,
        limit: 12,
        offset
      };

    switch (type) {
      case 'user':
        endpoint = 'api/v2/search/suggest/user';
        params.hydrate = 1;
        break;

      case 'object/service':
        endpoint = 'api/v1/service/';
        params.hydrate = 1;
        break;

      default:
        params.taxonomies = [ type ];
        break;
    }

    const response = (await api.get(endpoint, params, this.controller.signal)) || {};

    return {
      entities: response.entities || [],
      offset: response['load-next'] || ''
    };
  }

  async getFeed(offset, type, filter, q) {
    if (this.controller)
      this.controller.abort();

    this.controller = new AbortController();

    let endpoint;
    // is search
    if (q) {
      return this.search({ offset, type, filter, q });
    }

    if (type == 'group') {
      endpoint = '/api/v1/groups/featured';    
    }else if (type == 'object/service') {
      endpoint = '/api/v1/service/'+ filter + '/' + type;
    } else {
      endpoint = 'api/v1/entities/' + filter + '/' + type;
    }

    try { 
      const data = await api.get(endpoint, { limit: 12, offset: offset }, this.controller.signal)
      if (type == 'object/service' ) {
		  
		data.entities=  data.services;
		if(offset)
			data.entities.shift();
      }
	  else if (type == 'group' && offset && data.entities) {
        data.entities.shift();
      }
      return {
        entities: data.entities,
        offset: data['load-next'],
      }
    } catch(err) {
      console.log('error');
      throw "Ooops";
    }
  }

}

export default new DiscoveryService();
