import { observable, action } from 'mobx'

import ServicesService from './ServicesService';
import ServiceModel from './ServiceModel';
import OffsetListStore from '../common/stores/OffsetListStore';

/**
 * Services store
 */
class ServicesStore {

  list = new OffsetListStore();

  @observable filter = 'featured';

  async loadList() {
    try {
		
      const response = await ServicesService.loadList(this.filter, this.list.offset)

      console.log('my data:');
      
	  
     // console.log(response.entities)
      if (response.entities) {
        if (this.list.offset) {
          response.entities.shift();
        }
        response.entities = ServiceModel.createMany(response.entities);
        this.list.setList(response);
      }

      return response;
    } catch (err) {
		console.error('error', err);
    }
  }

  @action
  async refresh() {
    await this.list.refresh();
    await this.loadList();
    this.list.refreshDone();
  }

  @action
  setFilter(filter) {
    this.filter = filter;
  }

  @action
    async save(banner,data) {
		this.isUploading = true;

		try {

		  if (banner) {
			
			await ServicesService.saveAndUpload({
				  uri: banner.uri,
				  type: banner.type,
				  name: banner.fileName || 'banner.jpg'
				},data);
		  }
		  else 
		  {
			 
			  await ServicesService.save(0,data);
		  }

		} catch (e) {
		  console.error(e);
		} finally {
		  this.isUploading = false;
		}
	}

  @action
  reset() {
    this.list.clearList();
    this.filter = 'trending';
  }
}

export default new ServicesStore();