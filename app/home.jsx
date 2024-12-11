import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,ToastAndroid, Platform, Alert } from 'react-native';
import {createStaticNavigation,useNavigation} from '@react-navigation/native';
import { Link, useRouter } from 'expo-router'
import {SignedIn, useAuth, useUser} from '@clerk/clerk-expo'
 

export default function InitialScreen() {
  const router = useRouter(); // Router for navigation
  const {user} = useUser();
  
  const { signOut, isSignedIn } = useAuth();
  
  useEffect(() => {
    if(!isSignedIn) {
      router.push("/home");
    }
  }, [isSignedIn]);

  const handleLogout = async () => {
    await signOut();
    if (Platform.OS === 'android') {
      ToastAndroid.show("로그아웃되었습니다.", ToastAndroid.SHORT);
    } else {
      Alert.alert("알림", "로그아웃되었습니다.");
    }
    router.push("/login"); // 이동
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ㅇㅇ커피 모드 선택</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/screens/GeneralScreen')} // 일반 화면으로 이동
      >
        <Text style={styles.buttonText}>일반</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/screens/SeniorScreen')} // 노인 화면으로 이동
      >
        <Text style={styles.buttonText}>노인</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/screens/VisualImpairScreen')} // 시각장애 화면으로 이동
      >
        <Text style={styles.buttonText}>시각장애</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout} // 시각장애 화면으로 이동
      >
        <Text style={styles.buttonText}>로그아웃</Text>
      </TouchableOpacity>






    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 10,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});