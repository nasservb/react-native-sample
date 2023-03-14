import {
  observable,
  action
} from 'mobx';

import channelService from './ChannelService';
import ChannelStore from './ChannelStore';
import wireService from '../wire/WireService';
import ModelStorageList from '../common/ModelStorageList';

/**
 * Channel Stores
 */
class ChannelStores {

  lastVisited = new ModelStorageList('lastchannels', 10);
  stores = {};

  store(guid) {
    if (!this.stores[guid]) {
      this.stores[guid] = new ChannelStore(guid);
    }
    return this.stores[guid];
  }

  @action
  garbageCollect() {
    let count = 0;
    for (guid in this.stores) {
      //garbage collect if the store isn't actively in use
      //and more than 5 stores are open
      if (this.stores[guid] && !this.stores[guid].active && count++ > 5) {
        this.stores[guid] = null;
        console.log(`[GARBAGE COLLECTED]: ${guid}`);
      }
    }
  }

  async addVisited(channel) {
    result = await this.lastVisited.unshift(channel);
    // if it already exist we move it to the beggining
    if (result == -1) this.lastVisited.moveFirst(channel.guid);
  }

  @action
  reset() {
    this.lastVisited = new ModelStorageList('lastchannels', 10);
    this.stores = {};
  }

}

export default new ChannelStores();
