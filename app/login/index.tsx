import { View, Text, Image,StyleSheet, useColorScheme, Pressable, Button  } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import * as WebBrowser from 'expo-web-browser'
import { Link, useRouter } from 'expo-router'
import { useOAuth, useUser } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'


export const useWarmUpBrowser = () => {
    React.useEffect(() => {
      // Warm up the android browser to improve UX
      // https://docs.expo.dev/guides/authentication/#improving-user-experience
      void WebBrowser.warmUpAsync()
      return () => {
        void WebBrowser.coolDownAsync()
      }
    }, [])
  }
  
  WebBrowser.maybeCompleteAuthSession()

export default function loginScreen() {
    const router = useRouter(); // Router for navigation
    const { user, isSignedIn } = useUser(); // Get user state


  useWarmUpBrowser()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  
  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/home', { scheme: 'myapp' }),
      })
 
      if (createdSessionId) {
        router.push('/home')
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err)
    }
  }, [])


  // Redirect if user is already signed in
  React.useEffect(() => {
    if (isSignedIn) {
      router.push('/home'); // Redirect to home page
    }
  }, [isSignedIn]);

  return (
    <View style={styles.background}>
      <Image source={require('../../assets/images/login.png')} 
    style={styles.loginScreen}
    />
      <View style={styles.loginTxtcheck}>
        <Text style={styles.loginTxt}>계정 등록</Text>
        <Text style={styles.loginTxt2}>본 서비스를 이용하기 앞서 구글 계정이 필요합니다.</Text>
        
        <Pressable
         onPress={onPress}
         style={styles.enterBtn}>
            <Text style={styles.loginTxt3}>구글 계정 로그인</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    background: {
      backgroundColor : Colors.white

    },
    loginScreen: {
        width:430,
        height: 500,
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
        color: Colors.gray,
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
        alignItems : 'center',
        marginTop : 50,
        //padding : 50
        
    },
    enterBtn : {
        padding : 10,
        backgroundColor : Colors.black,
        width : '100%',
        borderRadius : 14

    }

})