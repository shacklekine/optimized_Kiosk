import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import * as Speech from 'expo-speech'; // expo-speech 모듈 import

export default function VisualImpairScreen() {
  const [hasSpoken, setHasSpoken] = useState(false); // 음성 출력 여부
  const router = useRouter(); // Router for navigation

  // 화면 진입 시 자동으로 음성 출력
  useEffect(() => {
    if (!hasSpoken) { // 첫 화면 진입 시만 음성 출력
      Speech.speak('먹고가기 포장하기를 선택하세요. 먹고가기는 상단, 포장하기는 하단입니다.', {
        language: 'ko', // 한국어로 설정
      });
      setHasSpoken(true); // 음성을 출력한 후 상태 변경
    }
  }, [hasSpoken]); // hasSpoken 상태가 바뀔 때마다 실행

  return (
    <View style={styles.container}>
      <Text style={styles.title}>먹고가기 / 포장하기를 선택하세요</Text>

      {/* "먹고가기"와 "포장하기" 버튼을 보여주는 영역 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#007bff' }]} // 먹고가기 버튼 색상
          onPress={() => router.push('/screens/VisualImpairConfirmEat?option=먹고가기')}
        >
          <Text style={styles.buttonText}>🍽 먹고가기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#28a745' }]} // 포장하기 버튼 색상
          onPress={() => router.push('/screens/VisualImpairConfirmtake?option=포장하기')}
        >
          <Text style={styles.buttonText}>🛍 포장하기</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flex: 1, // 버튼 컨테이너가 화면을 채우도록 설정
    justifyContent: 'space-between', // 버튼들을 위아래로 배치
    width: '100%', // 버튼 컨테이너가 화면 너비를 가득 채우도록 설정
  },
  button: {
    width: '100%', // 버튼 너비를 100%로 설정하여 화면 너비에 맞추기
    height: 200, // 버튼 높이를 크게 설정
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center', // 텍스트를 버튼 중앙에 정렬
    elevation: 5, // 그림자 효과 (Android)
    shadowColor: '#000', // 그림자 효과 (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 40, // 버튼 텍스트 크기를 크게 설정
    color: '#fff',
    fontWeight: 'bold',
  },
});
