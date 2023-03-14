import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';

import { observer, inject } from 'mobx-react/native'

import TransparentButton from '../../../common/components/TransparentButton';

import { CommonStyle } from "../../../styles/Common";
import Web3Service from '../../services/Web3Service';
import { ComponentsStyle } from '../../../styles/Components';

function addressExcerpt(address) {
  return `0×${address.substr(2, 5)}...${address.substr(-5)}`;
}

@inject('blockchainWallet')
@observer
export default class BlockchainWalletImportScreen extends Component {
  state = {
    importingRemote: false,
    remoteAddress: '',
    privateKey: ''
  };

  componentWillMount() {
    const params = this.props.navigation.state.params || {};

    this.setState({
      importingRemote: !!params.address,
      remoteAddress: params.address || '',
      privateKey: ''
    });
  }

  canImport() {
    return this.props.blockchainWallet.canImport(this.state.privateKey);
  }

  importAction = async () => {
    const address = Web3Service.getAddressFromPK(this.state.privateKey);

    if (
      this.state.importingRemote &&
      address.toLowerCase() !== this.state.remoteAddress.toLowerCase()
    ) {
      Alert.alert(
        'Import',
        `Private Key doesn't belong to ${addressExcerpt(this.state.remoteAddress)}.`,
        [
          { text: 'OK' },
        ],
        { cancelable: false }
      );

      return;
    }

    Alert.alert(
      'Import',
      `Import wallet ${addressExcerpt(address)} onto Minds using your Private Key?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => this.import() },
      ],
      { cancelable: false }
    );
  };

  cancelAction = () => {
    this.props.navigation.goBack();
  };

  async import() {
    await this.props.blockchainWallet.import(this.state.privateKey);

    const params = this.props.navigation.state.params || {};

    if (params.onSuccess) {
      params.onSuccess();
    }

    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={[ CommonStyle.flexContainer, CommonStyle.screen, CommonStyle.backgroundWhite ]}>
        {this.state.importingRemote && <Text style={CommonStyle.modalTitle}>Import wallet for {addressExcerpt(this.state.remoteAddress)}</Text>}
        {!this.state.importingRemote && <Text style={CommonStyle.modalTitle}>Import wallet</Text>}

        <Text style={styles.note}>
          Enter your private key for your wallet below to import.
        </Text>

        <View style={CommonStyle.field}>
          <TextInput
            style={[ ComponentsStyle.input, styles.addressTextInput ]}
            onChangeText={privateKey => this.setState({ privateKey })}
            value={this.state.privateKey}
            placeholder="1234567890abcdef…"
            multiline={true}
            maxLength={64}
          />
        </View>

        <View style={styles.actionBar}>
          <TransparentButton
            style={styles.actionButton}
            color={colors.darkGreyed}
            onPress={this.cancelAction}
            title="Cancel"
          />

          <TransparentButton
            disabled={!this.canImport()}
            style={styles.actionButton}
            color={colors.primary}
            onPress={this.importAction}
            title="Import"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '800',
    fontSize: 18,
    color: '#444',
    marginBottom: 8,
  },
  note: {
    fontSize: 12,
    marginBottom: 10,
    color: '#aaa',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end'
  },
  actionButton: {
    marginLeft: 5,
  },
  addressTextInput: {
    paddingTop: 16,
  },
});
