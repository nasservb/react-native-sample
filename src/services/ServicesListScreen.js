import React, {
  Component
} from 'react';

import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native';

import { Icon } from 'react-native-elements'
import IonIcon from 'react-native-vector-icons/Ionicons';

import ServiceCard from './ServiceCard';
import ServiceCreateButton from './ServiceCreateButton';
import Toolbar from '../common/components/toolbar/Toolbar';

import { CommonStyle } from '../styles/Common';

/**
 * Services List screen
 */
@inject('services')
@observer
export default class ServicesListScreen extends Component {

	static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="store" size={24} color={tintColor} />
    )
  }
  /**
   * Load data on mount
   */
  componentWillMount() {
    this.props.services.loadList();
  }

  renderRow = (row) => {
    const service = row.item;
    return (
      <View style={styles.cardContainer}>
        <ServiceCard entity={service} navigation={this.props.navigation} />
      </View>
    );
  }

  loadMore = () => {
    this.props.services.loadList();
  }

  /**
   * Render Tabs
   */
  renderToolbar() {
    selectedTextStyle={color: 'black'};
    const typeOptions = [
      { text: 'برگزیده', value: 'featured', selectedTextStyle},
      { text: 'درحال رشد', value: 'trending', selectedTextStyle},
      { text: 'کسب و کار من', value: 'owner', selectedTextStyle},
    ]
    return (
      <Toolbar
        options={ typeOptions }
        initial={ this.props.services.filter }
        onChange={ this.onTabChange }
      /> 
    )
  }

  onTabChange = (value) => {
    this.props.services.setFilter(value);
    this.props.services.refresh();
  }

  refresh = () => {
    this.props.services.refresh();
  }

  render() {
    const store = this.props.services;
    if (!store.list.loaded && !store.list.refreshing) {
      return (
        <View style={styles.activitycontainer}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }


    return ( 
	<View style={CommonStyle.flexContainer}>
      <FlatList
        data={store.list.entities.slice()}
        removeClippedSubviews
        onRefresh={this.refresh}
        refreshing={store.list.refreshing}
        onEndReached={this.loadMore}
        onEndThreshold={0.09}
        renderItem={this.renderRow}
        keyExtractor={item => item.guid}
        style={styles.list}
        ListHeaderComponent={this.renderToolbar()}
        getItemLayout={(data, index) => (
          { length: 300, offset: 308 * index, index }
        )}
      />	
	   <ServiceCreateButton navigation={this.props.navigation} />
	  </View>    
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: '#FFF'
  },
  cardContainer: {
    backgroundColor: '#ececec',
    paddingBottom: 8,
  }
});