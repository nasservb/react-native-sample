import { 
  observable,
  action,
  computed 
} from 'mobx'

import { 
  getFeedChannel,
  toggleComments, 
  toggleExplicit, 
  setViewed 
} from '../newsfeed/NewsfeedService';

import channelService from './ChannelService';

import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import ActivityModel from '../newsfeed/ActivityModel';
import BlogModel from '../blogs/BlogModel';
import ServiceModel from '../services/ServiceModel';
/**
 * Channel Feed store
 */
export default class ChannelFeedStore {

  @observable filter = 'feed';
  @observable showrewards = false;

  viewed = [];
  @observable stores = {
    feed: {
      list: new OffsetFeedListStore('shallow'),
      loading: false,
    },
    images: {
      list: new OffsetFeedListStore('shallow'),
      loading: false,
      isTiled: true,
    },
    videos: {
      list: new OffsetFeedListStore('shallow'),
      loading: false,
      isTiled: true,
    },
    blogs: {
      list: new OffsetFeedListStore('shallow'),
      loading: false,
      isTiled: false,
    },
    services: {
      list: new OffsetFeedListStore('shallow'),
      loading: false,
      isTiled: false,
    },
  };

  /**
   * Channel guid
   */
  guid = null;

  constructor(guid) {
    this.guid = guid;
  }

  get list() {
    return this.stores[this.filter].list;
  }

  set list(value) {
    this.stores[this.filter] = value;
  }

  @computed
  get loading() {
    return this.stores[this.filter].loading;
  }

  set loading(value) {
    this.stores[this.filter].loading = value;
  }

  @computed
  get isTiled() {
    return this.stores[this.filter].isTiled;
  }

  /**
   * Set channel guid
   * @param {string} guid
   */
  setGuid(guid) {
    this.guid = guid;
  }

  /**
   * Generate a unique Id for use with list views
   * @param {object} feed
   */
  assignRowKeys(feed) {
    if (!feed.entities) return;
    feed.entities.forEach((entity, index) => {
      entity.rowKey = `${entity.guid}:${index}:${this.list.entities.length}`;
    });
  }

  @action
  async addViewed(entity) {
    if(this.viewed.indexOf(entity.guid) < 0) {
      let response;
      try {
        response = await setViewed(entity);
        if (response) {
          this.viewed.push(entity.guid);
        }
      } catch (e) {
        throw new Error('There was an issue storing the view');
      }
    }
  }

  async loadFeed(refresh = false) {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    switch (this.filter) {
      case 'feed':
        await this._loadFeed(refresh);
        break;
      case 'images':
        await this._loadImagesFeed(refresh);
        break;
      case 'videos':
        await this._loadVideosFeed(refresh);
        break;
      case 'blogs':
        await this._loadBlogsFeed(refresh);
        break;
      case 'services':
        await this._loadServicesFeed(refresh);
        break;
    }
  }

  /**
   * Load channel feed
   */
  async _loadFeed(refresh = false) {
    this.loading = true;
    const filter = this.filter;

    try {
      const feed = await getFeedChannel(this.guid, this.list.offset)
      this.assignRowKeys(feed);
      feed.entities = ActivityModel.createMany(feed.entities);
      this.list.setList(feed, refresh);
    } catch (err) {
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load channel images feed
   */
  async _loadImagesFeed(refresh = false) {
    console.log('refreshing', refresh);

    this.loading = true;
    const filter = this.filter;

    try {
      const feed = await channelService.getImageFeed(this.guid, this.list.offset);
      feed.entities = ActivityModel.createMany(feed.entities);
      this.assignRowKeys(feed);
      console.log(feed);
      this.list.setList(feed, refresh);
    } catch (err) { 
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load channel videos feed
   */
  async _loadVideosFeed(refresh = false) {
    this.loading = true;
    const filter = this.filter;

    const feed = await channelService.getVideoFeed(this.guid, this.list.offset);

    if (this.filter == 'videos') {
      this.loading = false;
      feed.entities = ActivityModel.createMany(feed.entities);
      this.assignRowKeys(feed);
      this.list.setList(feed, refresh);
    }

    this.stores[filter].loading = false;
  }

  /**
   * Load channel videos feed
   */
  async _loadBlogsFeed(refresh) {
    this.loading = true;
    const filter = this.filter;

    const feed = await channelService.getBlogFeed(this.guid, this.list.offset);

    if (this.filter == 'blogs') {
      if (this.list.offset) {
        feed.entities.shift();
      }
      feed.entities = BlogModel.createMany(feed.entities);
      this.assignRowKeys(feed);
      this.list.setList(feed, refresh);
    }
	 

    this.stores[filter].loading = false;
  }

  /**
   * Load channel services
   */
  async _loadServicesFeed(refresh) {
    this.loading = true;
    const filter = this.filter;

    const feed = await channelService.getServiceFeed(this.guid, this.list.offset);
 
	
    if (this.filter == 'services') {
      if (this.list.offset) {
        feed.entities.shift();
      }
      feed.entities = ServiceModel.createMany(feed.entities);
      this.assignRowKeys(feed);
      this.list.setList(feed, refresh);
    }

    this.stores[filter].loading = false;
  }

  @action
  clearFeed() {
    this.list.clearList();
    this.isTiled = false;
    this.filter      = 'feed';
    this.showrewards = false;
  }

  @action
  async refresh() {
    //ignore refresh on rewards view
    if (this.filter == 'rewards') {
      return;
    }
    //this.list.refresh();
    await this.list.clearList();
    await this.loadFeed(true);
    this.viewed = [];
    this.list.refreshDone();
  }

  @action
  setFilter(filter) {
    this.filter = filter;

    this.refresh();
  }

}
