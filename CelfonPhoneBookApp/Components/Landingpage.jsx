import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

const PRODUCTS = [
  {
    id: '1',
    Product: 'Lathe Machine',
    color: '#24484e',
    image: require('../src/assets/images/Product1.png'), 
  },
  {
    id: '2',
    Product: 'Welding Unit',
    color: '#1c6d66',
    image: require('../src/assets/images/Product2.png'),
  },
  {
    id: '3',
    Product: 'Hydraulic Press',
    color: '#f3dcd5',
    image: require('../src/assets/images/Product3.png'),
    textColor: '#000',
  },
  {
    id: '4',
    Product: '3D Printer',
    color: '#c73629',
    image: require('../src/assets/images/Product4.png'),
  },
];

const ProductCard = ({ Product, color, image, textColor = '#fff', onPress }) => (
  <TouchableOpacity
    style={[styles.cardContainer, { backgroundColor: color }]}
    onPress={onPress}
  >
    <View style={styles.imageShelf}>
      <Image source={image} style={styles.image} resizeMode="contain" />
    </View>
    <View style={styles.textWrapper}>
      <Text style={[styles.brandText, { color: textColor }]}>{Product}</Text>
    </View>
  </TouchableOpacity>
);

export default function App() {
  const handleProductPress = productName => {
    Alert.alert(`${productName}`, `Showing items under ${productName}`);
    // You can replace with navigation logic here
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={PRODUCTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard
            {...item}
            onPress={() => handleProductPress(item.Product)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    height: 100,
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  imageShelf: {
    position: 'absolute',
    right: 15,
    bottom: 5,
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
  },
  textWrapper: {
    flexDirection: 'column',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
