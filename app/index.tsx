import React from 'react'
import { View, Text, Image,StyleSheet, useColorScheme, Pressable, Button, TouchableOpacity  } from 'react-native'
import { Colors } from '@/constants/Colors'
import * as WebBrowser from 'expo-web-browser'
import { Link, useRouter } from 'expo-router'
import * as Linking from 'expo-linking'


export default function index() {

  return (
    <View style={{
      backgroundColor : Colors.lightGray
  }}>
    <Image source={require('./../assets/images/coffee.png')} 
    style={styles.loginScreen}
    />
    <View style={styles.loginTxtcheck}>
      <Text style={styles.loginTxt}>당신에게 맞는 최적화 Kiosk</Text>
      <Text style={styles.loginTxt2}>다양한 옵션을 선택해서 서비스의 질을 높여보세요</Text>
      
   
       <TouchableOpacity style={styles.enterBtn}>
        <Link href="../login" asChild >
          <Text style={styles.loginTxt3}>Get Started</Text>
        </Link>
        </TouchableOpacity>
    </View>
  </View>
    
  )
}

const styles = StyleSheet.create({
  loginScreen: {
      width:'100%',
      height: '80%',
      justifyContent : 'center',
      resizeMode : 'stretch',
  },
  loginTxt: {
      fontFamily: 'black-han',
      fontSize : 30,
      textAlign: 'center'
  },
  loginTxt2: {
      //fontFamily: 'black-han',
      fontSize : 15,
      textAlign: 'center',
      color: Colors.white,
      padding : 10
  },
  loginTxt3: {
      fontFamily: 'black-han',
      fontSize : 15,
      textAlign: 'center',
      color: Colors.white,
      padding : 10
  },
  loginTxtcheck: {
      padding: 20,
      display : 'flex',
      alignItems : 'center'
      
  },
  enterBtn : {
      padding : 10,
      backgroundColor : Colors.primary,
      width : '100%',
      borderRadius : 14

  }

})