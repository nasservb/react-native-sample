import React, {
  Component
} from 'react';

import {
  Text,
  Image,
  View,
  ActivityIndicator,
  Button,
  StyleSheet
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import channelService from './ChannelService';
import { MINDS_URI } from '../config/Config';
import ActionSheet from 'react-native-actionsheet';
import WireAction from '../newsfeed/activity/actions/WireAction';
import featuresService from '../common/services/features.service';

/**
 * Channel Actions
 */
const title = 'Actions';
@observer
export default class ChannelActions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selected: '',
    }

    this.handleSelection = this.handleSelection.bind(this);
  }

  showActionSheet() {
    this.ActionSheet.show();
  }

  handleSelection(i) {
    this.makeAction(i);
  }

  getOptions() {
    let options = [ 'انصراف' ];

    if(this.props.channel.channel.subscribed){
      options.push( 'دنبال نکردن' );
    }

    if (!this.props.channel.channel.blocked) {
      options.push( 'بلاک' );
    } else {
      options.push( 'رفع بلاک' );
    }

    options.push( 'گزارش' );

    return options;

  }

  makeAction(option) {
    let options = this.getOptions();
    let selected = options[option];
    switch (selected) {
      case 'دنبال نکردن':
        this.props.channel.subscribe();
        break;
      case 'بلاک':
        this.props.channel.toggleBlock();
        break;
      case 'رفع بلاک':
        this.props.channel.toggleBlock();
        break;
      case 'گزارش':
        this.props.navigation.navigate('Report', { entity: this.props.channel.channel });
        break;
    }

    
  }
  
  /**
   * Render Header
   */
  render() {

    const channel = this.props.channel.channel;
    const showWire = !channel.blocked && !channel.isOwner() && featuresService.has('crypto');

    return (
      <View style={styles.wrapper}>
        
        <Icon name="md-settings" style={ styles.icon } onPress={() => this.showActionSheet()} size={24} />
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={title}
          options={this.getOptions()}
          onPress={this.handleSelection}
          cancelButtonIndex={0}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
	wrapper: {
    backgroundColor: '#FFF',
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: featuresService.has('crypto') ? 60 : 40,
    height: 40,
  },
  icon: {
    paddingLeft: 10,
    color: '#888888',
  },
});
