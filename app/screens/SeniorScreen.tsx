
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react';


export default function SeniorScreen() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const router = useRouter(); // Router for navigation
  const handlePress = (option:string) => {
    setSelectedOption(option); // 선택한 옵션을 상태에 저장
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>먹고가기 / 포장하기를 선택하세요</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#007bff' }]} // 먹고가기 버튼 색상
        onPress={() => router.push('/screens/SeniorOrder')}
      > 
        <Text style={styles.buttonText}>🍽 먹고가기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#28a745' }]} // 포장하기 버튼 색상
        onPress={() => router.push('/screens/SeniorOrder')}
      >
        <Text style={styles.buttonText}>🛍 포장하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // 배경색 설정
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    width: '90%', // 버튼 너비 (화면 너비의 90%)
    paddingVertical: 20, // 버튼 높이
    borderRadius: 15,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 5, // 그림자 효과 (Android)
    shadowColor: '#000', // 그림자 효과 (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});