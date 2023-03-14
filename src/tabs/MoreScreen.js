import React, {
    Component
} from 'react';

import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Linking
} from 'react-native';

import {
  inject
} from 'mobx-react/native'

import {
  MINDS_URI
} from '../config/Config';

import {
  NavigationActions
} from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { logout } from './../auth/LoginService';
import { List, ListItem } from 'react-native-elements'
import FastImage from 'react-native-fast-image';

import { ComponentsStyle } from '../styles/Components';
import { CommonStyle } from '../styles/Common';
import shareService from '../share/ShareService';


const ICON_SIZE = 24;

/**
 * More screen (menu)
 */
@inject('user', 'navigatorStore')
export default class MoreScreen extends Component {

  state = {
    active: false,
    activities: [],
    refreshing: false
  }

  /**
   * On component will mount
   */
  componentWillMount() {
    // load data on enter
    this.disposeEnter = this.props.navigatorStore.onEnterScreen('More', (s) => {
      this.setState({ active: true });
    });

    // clear data on leave
    this.disposeLeave = this.props.navigatorStore.onLeaveScreen('More', (s) => {
      this.setState({ active: false });
    });
  }

  /**
   * Dispose reactions of navigation store on unmount
   */
  componentWillUnmount() {
    this.disposeEnter();
    this.disposeLeave();
  }

  render() {
    // if tab is not active we return a blank view
    if (!this.state.active) {
      return <View style={CommonStyle.flexContainer} />
    }

    const list = [
      
      {
        name: 'ثبت کسب و کار',
        icon: (<Icon name='store' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.props.navigation.navigate('ServiceCreate');
        }
      },
      {
        name: 'راهنمایی و آموزش',
        icon: (<Icon name='help-outline' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.props.navigation.navigate('GroupView', { guid: '100000000000000681'});
        }
      },
      {
        name: 'دعوت از دوستان',
        icon: (<Icon name='share' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          shareService.invite(this.props.user.me.guid);
        }
      },
      {
        name: 'تنظیمات',
        icon: (<Icon name='settings' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.props.navigation.navigate('Settings');
        }
      },
      {
        name: 'اعلانات',
        icon: (<Icon name='notifications' size={ICON_SIZE} style={ styles.icon } />),
        onPress: () => {
          this.props.navigation.navigate('NotificationsSettings');
        }
      },
      {
        name: 'خروج',
        icon: (<Icon name='power-settings-new' size={ICON_SIZE} style={ styles.icon } />),
        onPress: () => {
          logout();
          const loginAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Login' })
            ]
          })

          this.props.navigation.dispatch(loginAction);
        }
      },
      {
        name: 'پرسش های متداول',
        icon: (<Icon name='open-in-new' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          Linking.openURL(MINDS_URI + 'faq');
        }
      }, {
        name: 'قوانین',
        icon: (<Icon name='open-in-new' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          Linking.openURL(MINDS_URI + 'p/terms');
        }
      }, {
        name: 'حریم شخصی',
        icon: (<Icon name='open-in-new' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          Linking.openURL(MINDS_URI + 'p/privacy');
        }
      }
    ];

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewContainer}>
          <List containerStyle={styles.container}>
            {
              list.map((l, i) => (
                <ListItem
                  key={i}
                  title={l.name}
                  titleStyle={styles.listTitle}
                  containerStyle={styles.listItem}
                  switchButton={l.switchButton}
                  hideChevron ={l.hideChevron}
                  leftIcon={l.icon}
                  onPress= {l.onPress}
                  noBorder
                />
              ))
            }
          </List>
          <View style={{flexGrow: 1}}>
          </View>
          <View style={styles.logoBackground}>
            { /*<FastImage
              resizeMode={FastImage.resizeMode.cover}
              style={[ComponentsStyle.logo, CommonStyle.marginTop2x]}
              source={require('../assets/logos/medium.png')}
            /> */ }
            <View style={styles.footer}>
              <Text style={styles.version} textAlign={'center'}>v1.0.0 (201804)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  onPressSettings = () => {
    this.props.navigation.navigate('Settings');
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
  scrollViewContainer: {
  },
  container: {
    flex: 1,
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  logoBackground: {
    paddingTop: 16,
    backgroundColor: '#FFF'
  },
	screen: {
    //paddingTop: 20,
    backgroundColor: '#FFF',
    flex: 1,
  },
  footer: {
    alignItems: 'stretch',
    width: '100%',
    height: 50,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingTop: 8,
    paddingBottom: 8,
    //height:20
  },
  listTitle: {
    padding:8,
    fontFamily: 'IRANSans',
  },
  icon: {
    color: '#455a64',
    alignSelf: 'center',
  },
  footercol: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  version: {
    marginTop: 16,
    fontSize: 16,
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#444'
  }
});