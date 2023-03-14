import React, {
  Component
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { OptimizedFlatList } from 'react-native-optimized-flatlist';

import NotificationsTabIcon from './NotificationsTabIcon';
import CenteredLoading from '../common/components/CenteredLoading';
import Notification from './notification/Notification';
import NotificationsTopbar from './NotificationsTopbar';
import CaptureFab from '../capture/CaptureFab';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

// style
const styles = StyleSheet.create({
  listView: {
    backgroundColor: '#FFF',
  },
  button: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  row: {
    padding: 16,
  },
});

/**
 * Notification Screen
 */
@inject('notifications', 'tabs', 'navigatorStore', 'user')
@observer
export default class NotificationsScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => (
      <NotificationsTabIcon tintColor={tintColor}/>
    ),
    headerRight: <Icon name="ios-options" size={18} color='#444' style={styles.button} onPress={() => navigation.navigate('NotificationsSettings')} />
  });

  /**
   * On component mount
   */
  componentWillMount() {
    this.disposeEnter = this.props.navigatorStore.onEnterScreen('Notifications', (s) => {
      this.props.notifications.loadList();
      this.props.notifications.setUnread(0);
    });

    this.disposeState = this.props.tabs.onState((state) => {
      if (!state.previousScene) return;
      if (state.previousScene.key == "Notifications" && state.previousScene.key == state.scene.route.key) {
        this.props.notifications.refresh();
      }
    });
  }

  /**
   * On component unmount
   */
  componentWillUnmount() {
    // clear data to free memory
    this.props.notifications.list.clearList();
    this.disposeState();
  }

  /**
   * Render screen
   */
  render() {
    let body;
    const me = this.props.user.me;
    const list = this.props.notifications.list;
    let empty = (<CenteredLoading />);


    if (list.loaded && !list.refreshing) {
      let filter = '';
      let design = null;

      if (this.props.notifications.filter != 'all') {
        filter = this.props.notifications.filter.substr(0, this.props.notifications.filter.length - 1);
      }

      if (me && me.hasBanned && !me.hasBanner()) { //TODO: check for avatar too
        design = <Text 
          style={ComponentsStyle.emptyComponentLink}
          onPress={() => this.props.navigation.navigate('Channel', { username: 'me' })}
          >
          Design your channel
        </Text>
      }

      empty = (
        <View style={ComponentsStyle.emptyComponentContainer}>
          <View style={ComponentsStyle.emptyComponent}>
            <MIcon name="notifications" size={72} color='#444' />
			 <Text style={ComponentsStyle.emptyComponentMessage}>هیچ اعلانی برای شما یافت نشد  {filter} </Text> 
            {design}
            <Text 
              style={ComponentsStyle.emptyComponentLink}
              onPress={() => this.props.navigation.navigate('Capture')}
              >
              نوشتن یک مطلب جدید
            </Text>
          </View>
        </View>);
    }
  
    body = (
      <FlatList
        data={list.entities.slice()}
        renderItem={this.renderRow}
        keyExtractor={item => item.rowKey}
        onRefresh={this.refresh}
        onEndReached={this.loadMore}
        ListEmptyComponent={empty}
        onEndThreshold={0.05}
        initialNumToRender={12}
        windowSize={8}
        refreshing={list.refreshing}
        style={styles.listView}
      />
    );

    return (
      <View style={styles.container}>
        <NotificationsTopbar  />
        {body}
        <CaptureFab navigation={this.props.navigation} />
      </View>
    );
  }

  /**
   * Clear and reload
   */
  refresh = () => {
    this.props.notifications.refresh();
  }

  /**
   * Load more rows
   */
  loadMore = () => {
    this.props.notifications.loadList()
  }

  /**
   * render row
   * @param {object} row
   */
  renderRow = (row) => {
    const entity = row.item;
    return (
      <Notification entity={entity} navigation={this.props.navigation}/>
    );
  }
}