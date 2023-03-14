import React, {
  PureComponent
} from 'react';

import {
  Text,
  StyleSheet,
  Modal,
  View,
  TouchableOpacity,
} from 'react-native';

import IonIcon from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';
import Remind from '../remind/Remind';
import { CommonStyle } from '../../../styles/Common';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

/**
 * Remind Action Component
 */
export default class RemindAction extends PureComponent {

  state = {
    remindModalVisible: false,
  }

  /**
   * Render
   */
  render() {
    return (
      <TouchableOpacityCustom style={[CommonStyle.flexContainer, CommonStyle.rowJustifyCenter]} onPress={this.remind}>
        <Icon color={this.props.entity['reminds'] > 0 ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'} name='repeat' size={20} />
        <Counter count={this.props.entity['reminds']} />
        <View style={styles.modalContainer}>
          <Modal animationType={"slide"} transparent={false}
            visible={this.state.remindModalVisible}
            onRequestClose={this.closeRemind}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <IonIcon onPress={this.closeRemind} color='gray' size={30} name='md-close' />
              </View>
              <Remind entity={this.props.entity} onClose={this.closeRemind} />
            </View>
          </Modal>
        </View>
      </TouchableOpacityCustom>
    )
  }

  /**
   * Close remind modal
   */
  closeRemind = () => {
    this.setState({ remindModalVisible: false });
  }

  /**
   * Open remind modal
   */
  remind = () => {
    this.setState({ remindModalVisible: true });
  }
}

const styles = StyleSheet.create({
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




