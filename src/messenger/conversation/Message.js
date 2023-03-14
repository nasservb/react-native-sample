import React, {
  PureComponent
} from 'react';

import {
  inject,
  observer
} from 'mobx-react/native'

import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import formatDate from '../../common/helpers/date';
import colors from '../../styles/Colors';
import { CommonStyle } from '../../styles/Common';
import { MINDS_CDN_URI } from '../../config/Config';
import crypto from '../../common/services/crypto.service';
import Tags from '../../common/components/Tags';

/**
 * Message Component
 */
@inject('user')
export default class Message extends PureComponent {

  stats = {
    showDate: false
  };

  /**
   * On component will mount
   */
  componentWillMount() {
    const message = this.props.message;
    this.setState({decrypted: message.decrypted});
    if (!message.decrypted) {

      this.setState({
        decrypted: false,
        msg: 'decrypting...'
      });

      // we need to decrypt inside a settimeout to fix blank list until decryption ends
      setTimeout(() => {
        crypto.decrypt(message.message)
          .then(msg => {
              this.setState({ decrypted: true, msg });
              message.decrypted = true;
              message.message = msg;
            });
      }, 0);

    } else {
      this.setState({ decrypted: true, msg: message.message });
    }
  }

  getIcontime(owner) {
    if (owner.guid == this.props.user.me.guid)
      return '/' + this.props.user.me.icontime;
    return '';
  }

  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    // only active if receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.navigate('Channel', { guid: this.props.message.owner.guid });
    }
  }

  /**
   * Render
   */
  render() {
    const message = this.props.message;
    const avatarImg = { uri: MINDS_CDN_URI + 'icon/' + message.owner.guid + '/small' + this.getIcontime(message.owner)};
    if (this.props.right) {
      return (
        <View>
          <View style={[styles.messageContainer, styles.right]}>
            <View style={CommonStyle.rowJustifyCenter}>
              <View style={CommonStyle.flexContainer}></View>
              <View style={[styles.textContainer, CommonStyle.backgroundPrimary]}  >
                <Text selectable={true} style={[styles.message, CommonStyle.colorWhite]} onPress={() => this.showDate()}>
                  <Tags color={'#fff'} style={{ color: '#FFF' }} navigation={this.props.navigation}>{this.state.msg}</Tags>
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={this._navToChannel}>
              <Image source={avatarImg} style={[styles.avatar, styles.smallavatar]} />
            </TouchableOpacity>
          </View>
          { this.state.showDate ?
            <Text selectable={true} style={[styles.messagedate, styles.rightText]}>{this.props.message.time_created_shamsi}</Text>
            : null }
        </View>
      );
    }

    return (
      <View>
        <View style={styles.messageContainer}>
          <TouchableOpacity onPress={this._navToChannel}>
            <Image source={avatarImg} style={[styles.avatar, styles.smallavatar]} />
          </TouchableOpacity>
          <View style={CommonStyle.rowJustifyCenter}>
            <View style={[ styles.textContainer ]}  >
              <Text selectable={true} style={[styles.message]} onPress={() => this.showDate()}>
                <Tags navigation={this.props.navigation}>{this.state.msg}</Tags>
              </Text>
            </View>
            <View style={CommonStyle.flexContainer}></View>
          </View>
        </View>
        { this.state.showDate ?
          <Text selectable={true} style={styles.messagedate}>{formatDate(this.props.message.time_created_shamsi)}</Text>
          : null }
      </View>
    );
  }

  showDate() {
    this.setState({
      showDate: !this.state.showDate
    });
  }

}


// styles
const styles = StyleSheet.create({
  smallavatar: {
    height: 28,
    width: 28,
    borderRadius: 14,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  textContainer: {
    flexWrap: 'wrap',
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: '#EEE',
    borderRadius: 15,
    marginLeft: 8,
    marginRight: 8,
  },
  messageContainer: {
    margin: 4,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  right: {
    justifyContent: 'flex-end',
  },
  rightText: {
    textAlign: 'right',
  },
  message: {
    padding: 16,
    maxWidth: 272,
  },
  messagedate: {
    fontSize: 9,
    marginTop: 2,
    marginLeft: 38,
    marginRight: 38
  }
});
