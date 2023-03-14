import { 
  StyleSheet,
  Dimensions,
} from 'react-native';

import colors from './Colors';

/**
 * Styles
 */
export const ComponentsStyle = StyleSheet.create({
  passwordinput: {
    borderColor: '#ECECEC',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 3,
    padding: 16,
  },
  input: {
    borderColor: '#ECECEC',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 3,
    padding: 16,
  },

  // login
  loginInput: {
    color: '#444',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
    padding: 15,
    // fontFamily: 'IRANSans',
    //backgroundColor: 'rgba(255,255,255, 0.9)',
    backgroundColor: '#f8f8f8',
    height: 50,
    borderRadius: 4,
  },
  loginButton: {
    borderRadius: 3,
    marginRight: 0,
    marginLeft: 10,
    backgroundColor: 'transparent',
    borderColor: '#FFF',
    borderWidth: 1
  },
  loginButtonText: {
    // fontFamily: 'IRANSans',
    fontWeight: '600',
    letterSpacing: 1.25
  },
  registerCheckboxText: {
    color: 'white'
  },
  registerCheckbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginRight: 0,
    alignSelf: 'flex-end'
  },

  //button
  commonButton: {
    margin: 4,
    padding: 4,
    alignItems: 'center',
    borderRadius: 3,
    backgroundColor: 'white',
    borderWidth: 1,
  },
  bluebutton: {
    margin:4,
    padding:4,
    alignItems:'center',
    borderRadius: 3,
    backgroundColor:'white',
    borderWidth:1,
    borderColor: colors.primary
  },
  redbutton: {
    margin: 4,
    padding: 4,
    alignItems:'center',
    borderRadius: 3,
    backgroundColor:'white',
    borderWidth:1,
    borderColor: colors.danger,
  },

  button: {
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 3,
    padding: 8,
  },

  buttonAction: {
    borderColor: colors.primary,
  },

  // background image
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  // logo
  logo: {
    width: 200,
    height: 84,
    marginBottom: 30,
    alignSelf: 'center'
  },
  link: {
    fontWeight: 'bold',
  },
  terms: {
    color: 'white',
    paddingRight: 8
  },


  emptyComponentContainer: { 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: Dimensions.get('window').height / 2,
  },
  emptyComponent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyComponentMessage: { 
    fontSize: 24,
    fontFamily: 'IRANSans',
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  emptyComponentLink: {
    fontFamily: 'IRANSans',
    color: colors.primary,
    marginTop: 16,
  },
});
