import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';


import { inject, observer } from 'mobx-react/native';

import { MINDS_CDN_URI, MINDS_LINK_URI } from '../config/Config';
import FastImage from 'react-native-fast-image';
import { Icon } from 'react-native-elements'
import ServiceViewHTML from './ServiceViewHTML';
import OwnerBlock from '../newsfeed/activity/OwnerBlock';
import formatDate from '../common/helpers/date';
import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';

import ThumbUpAction from '../newsfeed/activity/actions/ThumbUpAction';
import ThumbDownAction from '../newsfeed/activity/actions/ThumbDownAction';
import RemindAction from '../newsfeed/activity/actions/RemindAction';
import CommentsAction from '../newsfeed/activity/actions/CommentsAction';
import shareService from '../share/ShareService';
import CenteredLoading from '../common/components/CenteredLoading';

import api from '../common/services/api.service';
/**
 * Service View Screen
 */
@inject('user', 'servicesView')
@observer
export default class ServicesViewScreen extends Component {

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null
  }

  share = () => {
    const service = this.props.servicesView.service;
    shareService.share(service.title, service.perma_url);
  }

  componentWillMount() {
	  console.log('---call-service------');
    const params = this.props.navigation.state.params;

    //if (params.service) {
    //  this.props.servicesView.setService(params.service);
    //} else {
      this.props.servicesView.setService(null);
      this.props.servicesView.loadService(params.service.guid);
   // }
  }

  /**
   * Render
   */
  render() {
	   console.log('---call-service render------');
    const service = this.props.servicesView.service;

    if (!service) return <CenteredLoading/>

    //const image = { uri: service.thumbnail_src };
	const image = { uri:MINDS_LINK_URI +  'fs/v1/banners/'+service.guid , headers: api.buildHeaders() };
 
    const actions = (
      <View style={[CommonStyle.flexContainer, CommonStyle.paddingLeft2x]}>
        <View style={styles.actionsContainer}>
          <RemindAction entity={service} />
          <ThumbUpAction entity={service} orientation='column' me={this.props.user.me} />
          <ThumbDownAction entity={service} orientation='column' me={this.props.user.me} />
          <CommentsAction entity={service} navigation={this.props.navigation} />
        </View>
      </View>
    );
	

    return (
      <ScrollView style={styles.screen}>
        <FastImage source={image} resizeMode={FastImage.resizeMode.cover} style={styles.image} />
        <Text style={styles.title}>{service.title}</Text>
        <View >
          <OwnerBlock entity={service} navigation={this.props.navigation} rightToolbar={actions}>
            <Text style={styles.timestamp}>{service.time_created_shamsi}</Text>
          </OwnerBlock>
        </View>
        <View style={styles.description}>
		  <Text style={styles.description}>{service.description}</Text>
        </View>
        <View style={styles.description}>
		  <Icon name="md-call" size={30} color="#fff" />
		  <Text style={styles.description}>تلفن ثابت  : {service.phone}</Text>
        </View>		
        <View style={styles.description}>
		  <Icon name="md-call" size={30} color="#fff" />
		  <Text style={styles.description}>موبایل شماره : {service.mobile}</Text>
        </View>	
        <View style={styles.description}>
		  <Icon name="md-call" size={30} color="#fff" />
		  <Text style={styles.description}>تلگرام : {service.telegram}</Text>
        </View>	
        <View style={styles.description}>
		  <Icon name="md-call" size={30} color="#fff" />
		  <Text style={styles.description}>اینستاگرام : {service.instagram}</Text>
        </View>	
        <View style={styles.description}>
		  <Icon name="md-call" size={30} color="#fff" />
		  <Text style={styles.description}>وبسایت : {service.website}</Text>
        </View>	
        <View style={styles.description}>
		  <Icon name="md-call" size={30} color="#fff" />
		  <Text style={styles.description}>آدرس : {service.address}</Text>
        </View>		
        <View style={styles.moreInformation}>
          
          <Icon color={colors.primary} size={20} name='share' onPress={this.share} />
        </View>
        <Icon color="white" containerStyle={styles.header} size={30} name='arrow-back' onPress={() => this.props.navigation.goBack()}/>
      </ScrollView>
    )
  }
}

/**
 * Styles
 */
const styles = {
  header: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 40,
    width: 40,
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4
  },
  title: {
    paddingTop: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: 22,
    color: '#444',
    fontFamily: 'IRANSans',
    fontWeight: '800',
  },
  ownerBlockContainer: {
    margin: 8,
  },
  description: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 12,
  },
  screen: {
    backgroundColor: '#FFF'
  },
  image: {
    height: 200
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
  moreInformation: {
    padding: 12,
    flexDirection: 'row',
  },
}