import React, {
  Component
} from 'react';

import {
  Text,
  Image,
  View,
  ActivityIndicator,
  Button,
  StyleSheet,
  Modal,
  Alert,

} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import shareService from '../../share/ShareService';
import { toggleUserBlock } from '../NewsfeedService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionSheet from 'react-native-actionsheet';
import { MINDS_URI } from '../../config/Config';
/**
 * Activity Actions
 */
const title = 'Actions';

@inject("user")
@inject("newsfeed", "navigatorStore")
export default class ActivityActions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selected: '',
      reportModalVisible: false,
      userBlocked: false,
      options: this.getOptions(),
    }

    this.handleSelection = this.handleSelection.bind(this);
  }

  showActionSheet() {
    this.state = {
      options: this.getOptions(),
    }
    this.ActionSheet.show();
  }

  handleSelection(i) {
    this.makeAction(this.state.options[i]);
  }

  getOptions() {
    let options = [ 'انصراف' ];
    if (this.props.user.me.guid == this.props.entity.ownerObj.guid) {
      options.push( 'ویرایش' );

      options.push( 'حذف' );

      

    } else {

      if (this.props.user.isAdmin()) {
        options.push( 'حذف' );

        
      }

      if (this.state && this.state.userBlocked) {
        options.push( 'رفع بلاک' );
      } else {
        options.push( 'بلاک کاربر' );
      }

      options.push( 'گزارش' );
    }

    options.push( 'اشتراک گذاری' );

    if (!this.props.entity['is:muted']) {
      options.push( 'بستن اعلانات' );
    } else {
      options.push( 'بازکردن اعلانات' );
    }


    return options;

  }

  deleteEntity() {
    this.props.newsfeed.list.deleteEntity(this.props.entity.guid).then( (result) => {
      this.setState({
        options: this.getOptions(),
      });

      Alert.alert(
        'حذف',
        'مورد باموفقیت حذف شد',
        [
          {text: 'OK', onPress: () => {}},
        ],
        { cancelable: false }
      )

      if(this.props.navigatorStore.currentScreen == 'Activity' ){
        this.props.navigation.goBack();
      }
    });
  }

  makeAction(option) {
    switch (option) {
      case 'ویرایش':
        this.props.toggleEdit(true);
        break;
      case 'حذف':
        Alert.alert(
          'حذف',
          "آیا از حذف بدون برگشت مورد اطمینان دارید ؟ ",
          [
            {text: 'انصراف', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'تایید', onPress: () => this.deleteEntity()},
          ],
          { cancelable: false }
        )
        break;
      case 'بلاک کاربر':
        toggleUserBlock(this.props.entity.ownerObj.guid, !this.state.userBlocked).then( (result) => {
          this.setState({
            userBlocked:true,
            options: this.getOptions(),
          });
        });
        break;
      case 'رفع بلاک':
        toggleUserBlock(this.props.entity.ownerObj.guid, !this.state.userBlocked).then( (result) => {
          this.setState({
            userBlocked:false,
            options: this.getOptions(),
          });
        });
        break;
      case 'بستن اعلانات':
        this.props.newsfeed.list.newsfeedToggleMute(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'بازکردن اعلانات':
        this.props.newsfeed.list.newsfeedToggleMute(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'Monetize':
        this.props.newsfeed.list.toggleMonetization(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'Un-monetize':
        this.props.newsfeed.list.toggleMonetization(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
       case 'اشتراک گذاری':
        shareService.share(this.props.entity.text, MINDS_URI + 'newsfeed/' + this.props.entity.guid);
        break;
      case 'گزارش':
        this.props.navigation.navigate('Report', { entity: this.props.entity });
        break;
    }


  }

  /**
   * Close report modal
   */
  closeReport = () => {
    this.setState({ reportModalVisible: false });
  }

  /**
   * Render Header
   */
  render() {


    return (
      <View style={styles.wrapper}>
        <Icon
          name="more-vert"
          onPress={() => this.showActionSheet()}
          size={26}
          style={styles.icon}
          />
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
    flex:1,
    alignSelf: 'center'
  },
  icon: {
    color: '#888',
  },
  iconclose: {
    flex:1,
  },
  modal: {
    flex: 1,
    paddingTop: 4,
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: '#ede3f2',
  },
  modalHeader: {
    padding: 5
  }
});