import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  Text,  
  Image,
  Picker,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';


import { inject, observer } from 'mobx-react/native';

import { MINDS_CDN_URI, MINDS_LINK_URI } from '../config/Config';
import FastImage from 'react-native-fast-image';
import { Icon } from 'react-native-elements'
import OwnerBlock from '../newsfeed/activity/OwnerBlock';
import formatDate from '../common/helpers/date';
import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';

import Touchable from '../common/components/Touchable';

import ServicesStore from './ServicesStore';

import imagePicker from '../common/services/image-picker.service';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import CenteredLoading from '../common/components/CenteredLoading';
import Button from '../common/components/Button';
import api from '../common/services/api.service';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';

// prevent accidental double tap in touchables
const TouchableHighlightCustom = withPreventDoubleTap(TouchableHighlight);
const TouchableCustom = withPreventDoubleTap(Touchable);
const ButtonCustom = withPreventDoubleTap(Button);
/**
 * Service View Screen
 */
@inject('user', 'servicesView')
@observer
export default class ServiceCreateScreen extends Component {


	radio_props = [
	  {label: 'کسب و کار متعلق به خودم است ', value: 0 },
	  {label: 'کسب و کار متعلق به فرد دیگری است', value: 1 },
	];
	
  uploads = {
    avatar: null,
    banner: null
  };

  /**
   * Disable navigation bar
   */
   
  static navigationOptions = {
    header: null
  }

  save = () => {
	  //save
	    
		cat = Number( this.state.category) + 1;
		data = {
			owner: this.state.isOwn,
			title: this.state.title,
			description: this.state.description,
			published: 1,
			categories: cat,
			phone: this.state.phone,
			mobile: this.state.mobile,
			address: this.state.address,
			instagram: this.state.instagram,
			telegram: this.state.telegram,
			website: this.state.web,
		};
		
		console.log(data);
		 
		if (this.state.preview_banner)  
		{		

			ServicesStore.save(this.state.preview_banner,data);
		}
		else 
		{
			ServicesStore.save(0,data);
		}
	alert('اطلاعات ذخیره شد .');
  }


  
  state = {
    preview_banner: null,
    briefdescription: '',
    name: '',
    isOwn: 0,
    saving: false, 
	title: '',
	description: '',
	category: '',
	phone: '',
	mobile: '',
	address: '',
	instagram: '',
	telegram: '',
	web:'',
  };

	  


  componentWillMount() {
	  
    const params = this.props.navigation.state.params;

  }

  
 
  changeBannerAction = async () => {
    imagePicker.show('انتخاب سربرگ', 'photo')
      .then(response => {
        if (response) {
			
          this.selectMedia('banner', response);
        }
      }) 
      .catch(err => {
        alert(err);
      });
  };
  
    selectMedia(type, file) {
    this.setState({
      preview_banner: file
    });

    this.uploads[type] = file;
  }
  
   /**
   * Get Channel Banner
   */
  getBannerFromChannel() {
    if (this.state.preview_banner) {
      return {uri: this.state.preview_banner.uri};
    }

    return  { uri:MINDS_LINK_URI +  'assets/logos/service.jpg'  , headers: api.buildHeaders() };
  }
  /**
   * Render
   */
  render() {
	   
   
	 const banner  =this.getBannerFromChannel();
   
	
    return (
      <ScrollView style={styles.screen}>
		 <TouchableCustom onPress={this.changeBannerAction} >
          <Image source={banner} style={styles.banner} />
          <View style={styles.tapOverlayView}>
            <Icon name="create" size={30} color="#fff" />
          </View>
        </TouchableCustom>	
        <View   style={styles.rtl}  > 
		<RadioForm   
		  style={styles.rtl} 
		  radio_props={this.radio_props}
		  initial={0}
		  onPress={(value) => {this.setState({isOwn:value})}}
		/>
		</View>
		<View  style={styles.rtl}  >
			<Text style={styles.textView} >عنوان:</Text>
			<TextInput
				editable={true}
				placeholder='عنوان کسب و کار '
				placeholderTextColor='#ccc'
				underlineColorAndroid='transparent'
				style={styles.nameTextInput}
				multiline={false}
				onChangeText={(value) => {this.setState({title:value})}}
				selectTextOnFocus={false}
			  />
        </View>		
		  <View  style={styles.rtl}  >
			  <Text style={styles.textView} >توضیحات:</Text >
			  <TextInput
			   style={styles.briefdescriptionTextInputView}
				editable={true}
				placeholder='توضیحات کسب و کار را اینجا وارد بنویسید'
				placeholderTextColor='#ccc'
				underlineColorAndroid='transparent' 
				multiline={true}
				onChangeText={(value) => {this.setState({description:value})}}
				selectTextOnFocus={false}
			  />
        </View>
		  <View  style={styles.rtl}  >
		  <Text style={styles.textView} >دسته بندی:</Text >
          <Picker
			  selectedValue={this.state.category}
			  style={styles.nameTextInput}
			  onValueChange={(itemValue, itemIndex) => this.setState({category: itemValue})}>			  
				<Picker.Item value="101" label="خرید روزانه" />
				<Picker.Item value="110" label="کافه و رستوران" />
				<Picker.Item value="120" label="خدمات پزشکی" />
				<Picker.Item value="140" label="خدمات ورزشی" />
				<Picker.Item value="160" label="مواد غذایی ارگانیک" />
				<Picker.Item value="201" label="پوشاک آقایان" />
				<Picker.Item value="202" label="پوشاک بانوان" />
				<Picker.Item value="203" label="سیسمونی" />
				<Picker.Item value="204" label="کیف و کفش" />
				<Picker.Item value="205" label="زیورآلات" />
				<Picker.Item value="207" label="عطر و ادکلن" />
				<Picker.Item value="301" label="ازدواج و مراسمات" />
				<Picker.Item value="310" label="آرایشی و بهداشتی" />
				<Picker.Item value="320" label="خدمات زیبایی" />
				<Picker.Item value="330" label="آرایشگاه" />
				<Picker.Item value="401" label="موبایل و تبلت" />
				<Picker.Item value="410" label="لپ تاپ و کامپیوتر" />
				<Picker.Item value="430" label="ماشین های اداری" />
				<Picker.Item value="440" label="صوتی و تصویری" />
				<Picker.Item value="450" label="خدمات رسانه ای" />
				<Picker.Item value="501" label="املاک" />
				<Picker.Item value="520" label="خدمات ساختمان" />
				<Picker.Item value="610" label="تور زیارتی" />
				<Picker.Item value="620" label="تور داخلی" />
				<Picker.Item value="630" label="تور خارجی" />
				<Picker.Item value="640" label="اقامتگاه ها" />
				<Picker.Item value="670" label="اماکن مذهبی" />
				<Picker.Item value="680" label="اماکن تفریحی" />
				<Picker.Item value="701" label="مدارس و آموزشگاه" />
				<Picker.Item value="730" label="تدریس و پرستار" />
				<Picker.Item value="750" label="مشاوره" />
				<Picker.Item value="760" label="فرهنگی-مذهبی" />
				<Picker.Item value="780" label="فرهنگی-آموزشی" />
				<Picker.Item value="810" label="صنایع دستی، دکور" />
				<Picker.Item value="820" label="لوازم خانگی" />
				<Picker.Item value="850" label="تولیدات ساختمانی" />
				<Picker.Item value="860" label="تجهیزات اداری" /> 
			</Picker>
           
        </View>
		  <View  style={styles.rtl}  >
		  <Text style={styles.textView} >تلفن ثابت:</Text >
          <TextInput
            editable={true}
			 style={styles.nameTextInput}
            placeholder='تلفن ثابت'
            placeholderTextColor='#ccc'
            underlineColorAndroid='transparent' 
            multiline={false}
			onChangeText={(value) => {this.setState({phone:value})}}
            selectTextOnFocus={true}
          />
        </View>
		  <View  style={styles.rtl}  >
		  <Text  style={styles.textView}>موبایل:</Text >
          <TextInput
            editable={true}
            placeholder='شماره موبایل'
            placeholderTextColor='#ccc'
            underlineColorAndroid='transparent' 
            multiline={false}
			onChangeText={(value) => {this.setState({mobile:value})}}
			 style={styles.nameTextInput}
            selectTextOnFocus={true}
          />
        </View>
		  <View  style={styles.rtl}  >
		  <Text  style={styles.textView}>تلگرام:</Text >
          <TextInput
            editable={true}
			 style={styles.nameTextInput}
            placeholder='آی دی تلگرام'
            placeholderTextColor='#ccc'
            underlineColorAndroid='transparent' 
            multiline={false}
			onChangeText={(value) => {this.setState({telegram:value})}}
            selectTextOnFocus={true}
          />
        </View> 
		  <View   style={styles.rtl} >
		  <Text  style={styles.textView}>اینستاگرام:</Text >
          <TextInput
            editable={true}
			 style={styles.nameTextInput}
            placeholder='آی دی اینستاگرام'
            placeholderTextColor='#ccc'
            underlineColorAndroid='transparent' 
            multiline={false}
			onChangeText={(value) => {this.setState({instagram:value})}}
            selectTextOnFocus={true}
          />
        </View> 
		  <View  style={styles.rtl}  >
		  <Text  style={styles.textView}>وبسایت:</Text >
          <TextInput
            editable={true}
			 style={styles.nameTextInput}
            placeholder='آدرس وب سایت'
            placeholderTextColor='#ccc'
            underlineColorAndroid='transparent' 
            multiline={false}
			onChangeText={(value) => {this.setState({web:value})}}
            selectTextOnFocus={true}
          />
        </View> 
		  <View style={styles.rtl} >
		  <Text style={styles.textView}>آدرس:</Text >
          <TextInput
            editable={true}
			 style={styles.briefdescriptionTextInputView}
            placeholder='آدرس  '
            placeholderTextColor='#ccc'
            underlineColorAndroid='transparent' 
            multiline={true}
			onChangeText={(value) => {this.setState({address:value})}}
            selectTextOnFocus={true}
          />
        </View> 
        <Icon color="white" containerStyle={styles.header} size={30} name='arrow-back' onPress={() => this.props.navigation.goBack()}/>		
       
		<ButtonCustom
          onPress={this.save}
          text='ذخیره' 
        />
      </ScrollView>
    );
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
  tapOverlayView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#000',
    opacity: 0.65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    height: 190,
    backgroundColor: '#eee',
  },
  nameTextInput: {
    color: '#444',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#ececec',
    padding: 3,
	marginRight: 8,
    fontFamily: 'IRANSans',
	alignSelf: 'flex-end',
	width:'70%',
	textAlign: 'right',
    marginBottom: 4,
  },
  briefdescriptionTextInputView: {
    marginTop: 20,
    marginBottom: 20,	
	marginRight: 8,
    padding: 8,
    paddingTop: 3,
	justifyContent: 'space-between',
	alignSelf: 'flex-end',
    borderWidth: 1,
    borderRadius: 3,
	width:'90%',
	height:100,
	textAlign: 'right',
    borderColor: '#ececec',
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
    backgroundColor: '#FFF',
  },
  rtl: {	  
	  justifyContent: 'flex-end',
  }
  ,image: {
    height: 200
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
  textView: {
    padding: 8,
   
  },
}