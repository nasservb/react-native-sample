import React, {
  PureComponent
} from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

import { CommonStyle } from '../../../styles/Common';
import { ComponentsStyle } from '../../../styles/Components';
import featuresService from '../../../common/services/features.service';

import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';

// prevent double tap in touchable
const TouchableHighlightCustom = withPreventDoubleTap(TouchableHighlight);
/**
 * Boost Action Component
 */
export default class BoostAction extends PureComponent {

  /**
   * Render
   */
  render() {
    return (
      <View style={[ CommonStyle.flexContainer, CommonStyle.rowJustifyCenter ]}>
        <TouchableHighlightCustom
          style={[
            CommonStyle.flexContainer,
            CommonStyle.rowJustifyCenter,
            ComponentsStyle.bluebutton,
            CommonStyle.transparent
          ]}
          underlayColor="transparent"
          onPress={this.openBoost}
        >
          <Text style={[styles.text, CommonStyle.colorPrimary]}>BOOST</Text>
        </TouchableHighlightCustom>
      </View>
    );
  }

  /**
   * Open boost screen
   */
  openBoost = () => {
    if (featuresService.isLegacy()) {
      this.props.navigation.navigate('ComingSoon');
      return;
    } else if (!featuresService.has('monetization')) {
      this.props.navigation.navigate('NotSupported');
      return;
    }


    this.props.navigation.navigate('Boost', { entity: this.props.entity });
  }
}

const styles = StyleSheet.create({
  text: {
    paddingLeft: 2,
    paddingRight: 2,
    fontFamily: 'IRANSans',
  },
});
