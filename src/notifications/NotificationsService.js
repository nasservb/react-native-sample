import api from './../common/services/api.service';
import { AbortController } from 'abortcontroller-polyfill/dist/cjs-ponyfill';

export default class NotificationsService {

  controllers = {
    getFeed: null
  };

  async getFeed(offset, filter) {
    if (this.controllers.getFeed)
      this.controllers.getFeed.abort();

    this.controllers.getFeed = new AbortController();

    try {
      const data = await api.get('api/v1/notifications/' + filter, { offset: offset, limit: 15 }, this.controllers.getFeed.signal);
      return {
        entities: data.notifications,
        offset: data['load-next'],
      }
    } catch(err) {
      console.log('error', err);
      throw "Ooops";
    }
  }

}

export function getCount() {
  return api.get('api/v1/notifications/count');
}

export function getSettings() {
  return api.get('api/v1/notifications/settings');
}

export function setSetting(id, toggle) {
  return api.post('api/v1/notifications/settings', { id, toggle });
}