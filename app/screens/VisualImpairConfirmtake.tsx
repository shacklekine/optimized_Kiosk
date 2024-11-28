import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router'; // useRouter import
import React, { useEffect, useState } from 'react';
import * as Speech from 'expo-speech'; // expo-speech import

export default function VisualImpairConfirmEat() {
  const router = useRouter();
  // Timeout 대신 ReturnType<typeof setTimeout> 사용
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 화면 진입 시 음성 출력
    Speech.speak('포장하기를 선택하셨습니다. 화면을 탭하면 최종 확정됩니다. 만약 원치 않는다면 일정 시간 후 되돌아갑니다.', { language: 'ko' });

    // 15초 뒤 아무 선택 없이 돌아가도록 타이머 설정
    const newTimer = setTimeout(() => {
      Speech.speak('시간이 초과되었습니다. 다시 선택해 주세요. 먹고가기는 상단 포장하기는 하단입니다.', { language: 'ko' });
      router.back(); // 15초 후 자동으로 뒤로가기
    }, 15000); // 15초

    setTimer(newTimer); // 타이머 상태 업데이트

    // 컴포넌트 언마운트 시 타이머 클리어
    return () => clearTimeout(newTimer);
  }, [router]);

  const handleScreenTap = () => {
    // 화면을 탭했을 때 실행되는 동작
    if (timer) {
      clearTimeout(timer); // 타이머 취소
    }
    Speech.speak('포장하기 선택.', { language: 'ko' });
    // 주문 완료 후 다른 화면으로 이동 (여기서는 예시로 'SomeOtherScreen'으로 이동)
    router.push('/screens/VisualImpairOrder');
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View style={styles.container}>
        <Text style={styles.title}>포장하기 주문</Text>
        <Text style={styles.description}>
          포장 후 귀가해서 드시기 위해 주문하셨습니다. 화면을 탭하여 확인하세요.
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 20,
    marginBottom: 40,
    textAlign: 'center',
  },
});
