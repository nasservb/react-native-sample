import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {observer} from "mobx-react/native";

import {
  MINDS_URI,
  MINDS_CDN_URI
} from '../../config/Config';

import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Linking
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import AutoHeightFastImage from '../../common/components/AutoHeightFastImage';

import ExplicitText from '../../common/components/explicit/ExplicitText'
import OwnerBlock from './OwnerBlock';
import RemindOwnerBlock from './RemindOwnerBlock';
import Actions from './Actions';
import formatDate from '../../common/helpers/date';
import domain from '../../common/helpers/domain';
import ActivityActionSheet from './ActivityActionSheet';
import ActivityEditor from './ActivityEditor';
import ActivityMetrics from './metrics/ActivityMetrics';
import MediaView from '../../common/components/MediaView';

import Lock from '../../wire/lock/Lock';

/**
 * Activity
 */
@observer
export default class Activity extends Component {

  state = {
    editing: false
  }
  /**
   * Nav to activity full screen
   */
  navToActivity = () => {
    const navOpts = { entity: this.props.entity, store: this.props.newsfeed };

    if (this.props.entity.remind_object || this.props.hydrateOnNav) {
      navOpts.hydrate = true;
    }

    this.props.navigation.navigate('Activity', navOpts);
  };

  /**
   * Nav to full image with zoom
   */
  navToImage = () => {
    // if is a rich embed should load link
    if (this.props.entity.perma_url) {
      this.openLink();
    } else {
      this.props.navigation.navigate('ViewImage', { source: this.source });
    }
  }

  /**
   * Open a link
   */
  openLink = () => {
    Linking.openURL(this.props.entity.perma_url);
  }

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    const hasText = entity.message || entity.title;
    const lock = entity.paywall ? <Lock entity={entity} navigation={this.props.navigation}/> : null;

    const message = this.state.editing ?
      (
        //Passing the store in newsfeed (could be channel also)
        <ActivityEditor entity={entity} toggleEdit={this.toggleEdit} newsfeed={this.props.newsfeed} />
      ):(
        <View style={hasText ? styles.messageContainer : styles.emptyMessage}>
          {hasText ? <ExplicitText entity={entity} navigation={this.props.navigation} style={styles.message} /> : null}
        </View>
      );

    return (
        <View style={styles.container} onLayout={this.props.onLayout}>
          { this.showOwner() }
          { lock }
          { message }
          { this.showRemind() }
          <MediaView
            entity={ entity }
            navigation={this.props.navigation}
            style={ styles.media }
            newsfeed={this.props.newsfeed}
            autoHeight={ this.props.autoHeight }
            />
          { this.showActions() }
        </View>
    );
  }

  toggleEdit = (value) => {
    this.setState({ editing: value });
  }

  /**
   * Show Owner
   */
  showOwner() {
    if (!this.props.entity.remind_object) {
      const rightToolbar = (
        <View style={styles.rightToolbar}>
          <ActivityActionSheet newsfeed={this.props.newsfeed} toggleEdit={this.toggleEdit} entity={this.props.entity} navigation={this.props.navigation}/>
        </View>
      )
      return (
        <OwnerBlock
          entity={this.props.entity}
          navigation={this.props.navigation}
          rightToolbar={this.props.hideTabs ? null : rightToolbar}
          >
          <TouchableOpacity onPress={this.navToActivity} style={{ flexDirection: 'row' }}>
            <Text style={styles.timestamp}>{this.props.entity.time_created_shamsi}</Text>
           
            <ActivityMetrics entity={this.props.entity}/>
          </TouchableOpacity>
        </OwnerBlock>
      );
    } else {
      return  <View>
                <RemindOwnerBlock
                  entity={this.props.entity}
                  newsfeed={this.props.newsfeed}
                  navigation={this.props.navigation}
                  />
                <View style={styles.rightToolbar}>
                  <ActivityActionSheet
                    newsfeed={this.props.newsfeed}
                    toggleEdit={this.toggleEdit}
                    entity={this.props.entity}
                    navigation={this.props.navigation}
                  />
                </View>
              </View>

    }
  }

  /**
   * Show remind activity
   */
  showRemind() {
    if (this.props.entity.remind_object) {
      return (
        <View style={styles.remind}>
          <Activity
            hideTabs={true}
            newsfeed={this.props.newsfeed}
            entity={this.props.entity.remind_object}
            navigation={this.props.navigation}
            hydrateOnNav={true}
            />
        </View>
      );
    }
  }

  /**
   * Show actions
   */
  showActions() {
    if (!this.props.hideTabs) {
      return <Actions
                entity={this.props.entity}
                navigation={this.props.navigation}
                />
    }
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
    overflow: 'visible',
  },
  messageContainer: {
    padding: 8,
  },
  message: {
    fontFamily: 'IRANSans',
  },
  emptyMessage: {
    padding: 0
  },
  media: {
    //flex: 1,
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
  remind: {
  //  flex:1,
  },
  rightToolbar: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 10,
    top: 20
  },
  boostTagContainer: {
    flexDirection: 'row',
    paddingLeft: 8,
  },
  boostTagColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  boostTagIcon: {
    color: '#aaa',
  },
  boostTagLabel: {
    color: '#aaa',
    fontWeight: '800',
    marginLeft: 2,
    fontSize: 11,
  },
});
