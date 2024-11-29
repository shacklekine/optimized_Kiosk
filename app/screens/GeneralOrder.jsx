import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // 아이콘 라이브러리

// 상품 목록
const products = [
  { id: '1', name: '아메리카노', price: 1000, category: '커피', image: require('../../assets/images/americano.png'), description: '신선한 원두로 만든 깔끔한 아메리카노입니다.' },
  { id: '2', name: '녹차', price: 2000, category: '티', image: require('../../assets/images/green_tea.png'), description: '상쾌한 맛의 고급 녹차입니다.' },
  { id: '3', name: '카페라떼', price: 3000, category: '커피', image: require('../../assets/images/latte.png'), description: '부드러운 우유 거품이 일품인 카페라떼입니다.' },
  { id: '4', name: '딸기 스무디', price: 4000, category: '스무디/기타', image: require('../../assets/images/strawberry_smoothie.png'), description: '달콤한 딸기로 만든 시원한 스무디입니다.' },
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [showAlert, setShowAlert] = useState(false);
  const [isPaymentScreen, setIsPaymentScreen] = useState(false);  // 결제 화면 상태
  const [selectedCategory, setSelectedCategory] = useState('전체'); // 선택된 카테고리 상태
  const categories = ['전체', '커피', '티', '스무디/기타']; // 카테고리 목록
  
  const filteredProducts =
    selectedCategory === '전체'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        clearInterval(timer);
        setShowAlert(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (showAlert) {
      const hideAlertTimer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(hideAlertTimer);
    }
  }, [showAlert]);

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setTotalPrice(totalPrice + product.price);
  };
  
  const decreaseQuantity = (productId) => {
    const product = cart.find((item) => item.id === productId);
    if (product) {
      if (product.quantity > 1) {
        setCart(
          cart.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
          )
        );
        setTotalPrice(totalPrice - product.price);
      } else {
        removeFromCart(productId);
      }
    }
  };
  
  const removeFromCart = (productId) => {
    const product = cart.find((item) => item.id === productId);
    if (product) {
      setCart(cart.filter((item) => item.id !== productId));
      setTotalPrice(totalPrice - product.price * product.quantity);
    }
  };
  const resetCart = () => {
    setCart([]);
    setTotalPrice(0);
  };

  const handlePayment = () => {
    if (cart.length > 0) {
      setIsPaymentScreen(true);  // 결제 화면으로 전환
    } else {
      Alert.alert('카트가 비어 있습니다.', '상품을 추가하세요.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        {/* 이름과 가격을 한 줄로 배치하고 균등 정렬 */}
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price} 원</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={() => decreaseQuantity(item.id)}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>
          {cart.find((cartItem) => cartItem.id === item.id)?.quantity || 0}
        </Text>
        <TouchableOpacity
          onPress={() => addToCart(item)}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const PaymentScreen = () => (
    <View style={styles.container}>
      <Text style={styles.header}>결제 화면</Text>
      <Text style={styles.totalPrice}>총액: {totalPrice} 원</Text>
  
      {/* 결제 방법 선택 버튼들 */}
      <View style={styles.footerButtons}>
        <TouchableOpacity 
          onPress={() => alert('신용카드 결제')} 
          style={styles.paymentButton2}>
          <Icon name="card" size={30} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>신용카드</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => alert('카카오페이 결제')} 
          style={styles.paymentButton2}>
          <Icon name="logo-google" size={30} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>카카오페이</Text>
        </TouchableOpacity>
      </View>
  
      {/* 도움 요청 버튼과 뒤로 가기 버튼 */}
      <View style={styles.footerButtons}>
        <TouchableOpacity 
          onPress={() => alert('도움 요청')} 
          style={styles.footerButton}>
          <Icon name="help-circle" size={30} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>도움 요청</Text>
        </TouchableOpacity>
  
        <TouchableOpacity 
          onPress={() => setIsPaymentScreen(false)} 
          style={styles.footerButton}>
          <Icon name="arrow-back" size={30} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>뒤로 가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  //키오스크 화면 부속물 출력
  const KioskScreen = () => (
    <View style={styles.container}>
      {showAlert && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>시간이 모두 경과했습니다!</Text>
        </View>
      )}

      {/* 카테고리 탭 */}
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>


      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
      />

    <View style={styles.cartContainer}>
      <Text style={styles.cartTitle}>카트</Text>
      {cart.length > 0 ? (
        cart.map((item) => (
          <View key={item.id} style={styles.cartItemContainer}>
            <Text style={styles.cartItem}>
              {item.name} - {item.price} 원 x {item.quantity}
            </Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => decreaseQuantity(item.id)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => addToCart(item)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.cartItem}>카트에 담긴 상품이 없습니다.</Text>
      )}
    </View>

      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPrice}>총액: {totalPrice} 원</Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>남은 시간: {timeLeft}초</Text>
      </View>
      <TouchableOpacity onPress={resetCart} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>카트 리셋</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePayment} style={styles.paymentButton}>
        <Text style={styles.paymentButtonText}>결제 확인</Text>
      </TouchableOpacity>
    </View>
  );

  return isPaymentScreen ? <PaymentScreen /> : <KioskScreen />;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    paddingBottom: 100,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
  },
  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  image: {
    width: '50',
    height: '50',

  },
  productList: {
    marginBottom: 20,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 아이템 간 간격 균등 분배
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  textContainer: {
    flex: 1, // 텍스트 영역이 고정된 넓이를 가짐
    flexDirection: 'row', // 이름과 가격을 가로로 배치
    justifyContent: 'space-between', // 이름과 가격을 양 끝에 정렬
    marginLeft: 10, // 이미지와 텍스트 간 간격
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left', // 왼쪽 정렬
    flex: 1, // 텍스트가 고정된 폭을 차지
  },
  productPrice: {
    fontSize: 14,
    textAlign: 'right', // 오른쪽 정렬
    flex: 1,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
  },
  cartContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cartTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  cartItem: {
    fontSize: 16,
  },
  totalPriceContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resetButton: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  timeContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding : 10
  },
  alertContainer: {
    backgroundColor: '#f44336',
    padding: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
  },
  alertText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  paymentButton2: {
    flex: 1,
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  paymentButtonText: {
    color: '#fff',
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
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  icon: {
    marginBottom: 10,
  },
  categoryContainer: { flexDirection: 'row', marginBottom: 10 },
  categoryButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
  },
  selectedCategoryButton: { backgroundColor: '#007bff', borderColor: '#007bff' },
  categoryText: { fontSize: 14, color: '#333' },
  selectedCategoryText: { color: '#fff' },
});