import React, {
  PureComponent
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  View
} from 'react-native';

import {
  MINDS_CDN_URI
} from '../../config/Config';

import UserStore from '../../auth/UserStore';
import api from '../../common/services/api.service';

/**
 * Owner Block Component
 */
export default class OwnerBlock extends PureComponent {

  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    // only active if receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.navigate('Channel', { guid:this.props.entity.ownerObj.guid, entity: this.props.entity.ownerObj });
    }
  }
  
 getOwnerIcontime() {
    if(UserStore.me && UserStore.me.guid === this.props.entity.ownerObj.guid) {
      return UserStore.me.icontime;
    } else {
      return this.props.entity.ownerObj.guid;
    }
  }
  
  /**
   * Render
   */
  render() {
    const channel = this.props.entity.ownerObj;
	 
	
    const rightToolbar = this.props.rightToolbar||null;

	size='medium';
	avatarSrc=[];
	 try 
	 {
		 //avatarSrc = channel.getAvatarSource();
		 
		avatarSrc = { uri: `${MINDS_CDN_URI}icon/${channel.guid}/${size}/${this.getOwnerIcontime()}`, headers: api.buildHeaders()};
	 }
	 catch (e) 
	 {
		return(
		<View style={styles.container}>
		 </View>
		);
	}
	
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._navToChannel}>
          <Image source={avatarSrc} style={styles.avatar}/>
        </TouchableOpacity>
        <View style={styles.body}>
          <TouchableOpacity onPress={this._navToChannel}>
            <Text style={styles.username}>
              { channel.username }
            </Text>
          </TouchableOpacity>
          {this.props.children}
        </View>
        {rightToolbar}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: 0.5,
    borderColor: '#EEE',
  },
  body: {
    marginLeft: 8,
  },
  username: {
    fontWeight: 'bold',
    fontFamily: 'IRANSans',
    color: '#444',
  },
});
