import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Picker,
  Alert,
} from 'react-native';

import {
  NavigationActions
} from 'react-navigation';

import session from '../../common/services/session.service';
import { List, ListItem } from 'react-native-elements';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import settingsService from '../SettingsService';
import i18nService from '../../common/services/i18n.service';

export default class BillingScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{i18nService.t('settings.paymentMethods')}</Text>
        <View style={styles.cardcontainer}>
          <Text style={styles.creditcardtext}>{i18nService.t('settings.addCard')}</Text>
          <Button backgroundColor="#4690D6"
            title={i18nService.t('settings.add')} icon={{ name: 'ios-card', type: 'ionicon'}} />
        </View>
        <Text style={styles.header}>{i18nService.t('settings.recurringPayments')}</Text>
        <Text style={[styles.header, { marginTop: 20 }]}>{i18nService.t('categories')}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
});
