import React, { Component } from 'react';

import {
  observer,
  inject
} from 'mobx-react/native'

import { 
  View,
  StyleSheet,
} from 'react-native';

import { Icon } from 'react-native-elements'

export default class ServiceCreateButton extends Component {

  /**
   * Nav to activity full screen
   */
  navToCapture = () => {
    const { state } = this.props.navigation
    this.props.navigation.navigate('ServiceCreate', {group: this.props.group, parentKey: state.key});
  }

  render() {
    return (
      <Icon
        raised
        name="md-create"
        type='ionicon'
        color='#fff'
        size={32}
        containerStyle={styles.container}
        onPress={() => this.navToCapture()} 
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position:'absolute',
    backgroundColor:'#4690DF',
    width:55,
    height:55,
    bottom:8,
    right:8,
    zIndex:1000
  },
});