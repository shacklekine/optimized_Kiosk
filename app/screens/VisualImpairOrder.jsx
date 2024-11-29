import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import * as Speech from 'expo-speech'; // expo-speech 임포트
import Icon from 'react-native-vector-icons/Ionicons'; 

// 상품 목록
const products = [
  { id: '1', name: '아메리카노', price: 1000, image: require('../../assets/images/americano.png'), description: '상품 1 설명' },
  { id: '2', name: '녹차', price: 2000, image: require('../../assets/images/green_tea.png'), description: '상품 2 설명' },
  { id: '3', name: '카페라떼', price: 3000, image: require('../../assets/images/latte.png'), description: '상품 3 설명' },
  { id: '4', name: '딸기 스무디', price: 4000, image: require('../../assets/images/strawberry_smoothie.png'), description: '상품 4 설명' },
];

const { width } = Dimensions.get('window');

const VisualImpairOrder = () => {
  const [currentProduct, setCurrentProduct] = useState(products[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false); // 결제 확인 모달 상태 추가
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]); // 카트 상태 추가
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPaymentScreen, setIsPaymentScreen] = useState(false);  // 결제 화면 상태

  // 초반에 환영 메시지 출력
  useEffect(() => {
    Speech.speak('상품 선택입니다. 상품을 좌에서 우로 슬라이드하여 선택하세요.', { language: 'ko', rate: 1.0 });
    Speech.speak(`현재 선택된 상품은 ${currentProduct.name}입니다.`, { language: 'ko', rate: 1.0 });
  }, []);

  // 슬라이드가 변경될 때 상품 이름 읽어줌
  const handleSlideChange = (index) => {
    const product = products[index];
    setCurrentProduct(product);
    Speech.speak(`${product.name}`, { language: 'ko', rate: 1.0 });
  };

  // 증가 버튼 클릭
  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    Speech.speak(`현재 개수는 ${newQuantity}개입니다.`, { language: 'ko', rate: 1.0 });
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      Speech.speak(`현재 개수는 ${newQuantity}개입니다.`, { language: 'ko', rate: 1.0 });
    } else if (quantity === 1) {
      // 1에서 0으로 감소하려 할 때 처리
      setQuantity(0); // 0으로 설정
      setModalVisible(false); // 팝업 숨기기
      Speech.speak('취소되었습니다.', { language: 'ko', rate: 1.0 });
    }
  };

  // 확인 버튼 클릭 (카트에 상품 추가)
  const handleConfirm = () => {
    if (quantity > 0) {
      // 카트에 상품 추가
      const updatedCart = [...cart, { ...currentProduct, quantity }];
      setCart(updatedCart);
      setModalVisible(false); // 모달 닫기
      Speech.speak(`${currentProduct.name} ${quantity}개가 장바구니에 추가되었습니다.`, { language: 'ko', rate: 1.0 });
    }
  };

  // 카트에 담긴 상품 개수 출력
  const renderCartItemCount = () => {
    return cart.length > 0 ? `카트에 ${cart.length}개의 상품이 담겼습니다.` : '카트에 상품이 없습니다.';
  };

  // 카트 비우기
  const handleClearCart = () => {
    setCart([]); // 카트 비우기
    setTotalPrice(0);
    Speech.speak('카트가 비워졌습니다.', { language: 'ko', rate: 1.0 });
  };

  const handleCheckout = () => {
    let totalAmount = 0;
    let cartDetails = '';
    
    // 카트에 담긴 상품 정보 계산
    cart.forEach((item) => {
      totalAmount += item.price * item.quantity;
      cartDetails += `${item.name} ${item.quantity}개: ${item.price * item.quantity}원\n`;
    });
    
    // 카트가 비어있는 경우
    if (!cartDetails) {
      Speech.speak('카트가 비어있습니다.', { language: 'ko', rate: 1.0 });
      setCheckoutModalVisible(false); // 결제 모달 닫기
      return; // 더 이상 실행하지 않도록
    }
    
    // 카트에 담긴 상품이 있는 경우
    const checkoutMessage = `${cartDetails}총액은 ${totalAmount}원입니다. 결제를 원하시면 중앙기준 좌측에 확인버튼을 눌러주세요. 취소를 원하시면 우측버튼을 눌러주세요`;
    Speech.speak(checkoutMessage, { language: 'ko', rate: 1.0 });
  

    setTotalPrice(totalAmount);
    // 결제 모달 띄우기
    setCheckoutModalVisible(true);
  };

  // 결제 확인
  const handleConfirmCheckout = () => {
    let totalAmount = 0;
    cart.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });
    const checkoutMessage = `결제를 승인하였습니다. 총액은 ${totalAmount}원입니다.`;
    Speech.speak(checkoutMessage, { language: 'ko', rate: 1.0 });
    //setCart([]); // 결제 후 카트 비우기
    setIsPaymentScreen(true);
    setCheckoutModalVisible(false); // 결제 모달 닫기
  };

  const handleRejectCheckout = () => {
    Speech.speak('결제가 취소되었습니다.', { language: 'ko', rate: 1.0 });
    setCheckoutModalVisible(false);
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        Speech.speak(`${item.name}를 선택하셨습니다.`, { language: 'ko', rate: 1.0 });
        Speech.speak(`개수 선택 화면입니다. 중앙기준 좌측은 감소 우측은 증가이며 살짝 아래에 확인버튼을 누르면 장바구니에 담겨집니다. 취소를 원하시면 감소 버튼을 한번 누르시면 됩니다. 현재 개수는 1개입니다.`, { language: 'ko', rate: 1.0 });
        setQuantity(1); // 초기 개수 설정
        setModalVisible(true); // 모달 표시
      }}
    >
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}원</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  const PaymentScreen = () => (
    <View style={styles.container2}>
      <Text style={styles.header2}>결제 화면</Text>
      <Text style={styles.totalPrice}>총액: {totalPrice} 원</Text>
  
      {/* 결제 방법 선택 버튼들 */}
      <View style={styles.footerButtons}>
        <TouchableOpacity 
          onPress={() => {
            alert('신용카드 결제')
            Speech.speak(`신용카드 결제를 선택하셨습니다.`, { language: 'ko', rate: 1.0 });
          }} 
          style={styles.paymentButton2}>
          <Icon name="card" size={30} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText5}>신용카드</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => {
            alert('카카오페이 결제')
            Speech.speak(`카카오페이 결제를 선택하셨습니다.`, { language: 'ko', rate: 1.0 });
          }} 
          style={styles.paymentButtonKakao}>
          <Icon name="logo-google" size={30} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText5}>카카오페이</Text>
        </TouchableOpacity>
      </View>
  
      {/* 도움 요청 버튼과 뒤로 가기 버튼 */}
      <View style={styles.footerButtons}>
        <TouchableOpacity 
          onPress={() => {
            alert('도움 요청')
            Speech.speak(`도움 요청을 선택하셨습니다. 가까운 직원에게 도움을 요청합니다.`, { language: 'ko', rate: 1.0 });
          }} 
          style={styles.footerButtonhelp}>
          <Icon name="help-circle" size={30} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText5}>도움 요청</Text>
        </TouchableOpacity>
  
        <TouchableOpacity 
          onPress={() => {
            setIsPaymentScreen(false)
            Speech.speak(`뒤로 돌아가 메뉴 선택화면입니다. 현재 총액은 ${totalPrice}원 이며 상단부터 메뉴선택, 결제, 카트비우기 순으로 나열되어있습니다. `, { language: 'ko', rate: 1.0 });
          }} 
          style={styles.footerButton}>
          <Icon name="arrow-back" size={30} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText5}>뒤로 가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const KioskScreen = () => (
<View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        renderItem={renderItem}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          handleSlideChange(index); // 슬라이드 변경 시 호출
        }}
      />

      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={handleCheckout} // 결제하기 버튼 클릭 시 결제 처리
      >
        <Text style={styles.buttonText}>결제 하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addToCartButton2}
        onPress={handleClearCart} // 카트 비우기 버튼 클릭 시 카트 비우기
      >
        <Text style={styles.buttonText}>카트 비우기</Text>
      </TouchableOpacity>

      {/* 개수 선택 모달 */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentProduct.name} 개수 선택</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.quantityButton} onPress={handleDecrease}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={handleIncrease}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleConfirm} // 확인 버튼 클릭 시 카트에 추가
            >
              <Text style={styles.closeButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 결제 확인 모달 */}
      <Modal visible={checkoutModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>결제 확인</Text>
            <Text style={styles.cartDetails}>
              {cart.map((item) => (
                <Text key={item.id}>
                  {item.name} {item.quantity}개: {item.price * item.quantity}원{'\n'}
                </Text>
              ))}
            </Text>
            <Text style={styles.totalAmount}>
              총액: {cart.reduce((total, item) => total + item.price * item.quantity, 0)}원
            </Text>
            <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleConfirmCheckout} // 결제 확인 버튼
            >
              <Text style={styles.closeButtonText}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleRejectCheckout} // 결제 모달 닫기
            >
              <Text style={styles.closeButtonText}>취소</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 카트 상태 */}
      <View style={styles.cartStatusContainer}>
        <Text style={styles.cartStatusText}>{renderCartItemCount()}</Text>
      </View>
    </View>
  );

  return isPaymentScreen ? <PaymentScreen /> : <KioskScreen />;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { width, alignItems: 'center', padding: 20 },
  image: { width: 200, height: 200, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold' },
  price: { fontSize: 18, color: '#666' },
  description: { fontSize: 14, color: '#888', marginTop: 10 },
  addToCartButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom : 80
  },
  addToCartButton2: {
    backgroundColor: '#4CA450',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom : 80
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' , padding : 10, height:100 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  quantityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  quantityText: { fontSize: 24 },
  closeButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cartStatusContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  cartStatusText: { fontSize: 18, fontWeight: 'bold' },
  cartDetails: {
    fontSize: 16,
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row', // 버튼을 가로로 배치
    justifyContent: 'space-between', // 버튼 사이에 간격을 두기
    width: '100%', // 버튼이 가로로 꽉 차게
    marginTop: 20, // 여백을 추가해도 좋음
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 10,
    padding: 60,
    borderRadius: 10,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  footerButtonhelp: {
    flex: 1,
    marginHorizontal: 10,
    padding: 60,
    borderRadius: 10,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  buttonText5: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  paymentButton2: {
    flex: 1,
    marginHorizontal: 10,
    padding: 50,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  paymentButtonKakao: {
    flex: 1,
    marginHorizontal: 10,
    padding: 50,
    borderRadius: 10,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  icon: {
    marginBottom: 10,
  },
  container2: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    paddingBottom: 100,
    
  },
});

export default VisualImpairOrder;
