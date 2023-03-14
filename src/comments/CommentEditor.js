import React, {
  Component
} from 'react';

import {
  View,
  TextInput,
} from 'react-native';

import { Button } from 'react-native-elements';

import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';


/**
 * Comment editor
 */
export default class CommentEditor extends Component {

  state = {
    text: ''
  }

  /**
   * set the initial text
   */
  componentWillMount() {
    this.setState({
      text: this.props.comment.description
    });
  }

  /**
   * Cancel editing
   */
  cancel = () => {
    this.props.setEditing(false);
  }

  /**
   * Update comment
   */
  update = () => {
    this.props.store.updateComment(this.props.comment, this.state.text)
      .catch((err) => {
        console.log('error updating comment');
      })
      .finally(() => {
        this.props.setEditing(false);
      });
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={CommonStyle.flexContainer}>
        <TextInput
          style={{ width: '100%', borderColor: 'gray'}}
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => this.setState({ text })}
          value={this.state.text}
        />
        <View style={CommonStyle.rowJustifyEnd}>
          <Button title="انصراف" onPress={this.cancel} />
          <Button title="ذخیره" backgroundColor={colors.primary} onPress={this.update} disabled={this.props.store.saving}/>
        </View>
      </View>
    )
  }
}