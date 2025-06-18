import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AuthContext} from './AuthContext';

const Promotions = ({navigation}) => {
  const {user} = useContext(AuthContext);

  const handleGetStarted = route => {
    if (user) {
      navigation.navigate(route);
    } else {
      Alert.alert('Login Required', 'You need to login to access this feature');
      navigation.navigate('Login');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      {/* <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity> */}

      {/* Gold Loan Card */}
      <View style={styles.cardGold}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Nearby Promotions</Text>
          {/* <Text style={styles.cardSubtitle}>
            Turn your Bussiness for your Promotion
          </Text> */}
          <Image
            source={require('../src/assets/images/NearbyPromotions.png')}
            style={styles.image}
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.point}>⭐ Hyper-Targeted SMS Marketing </Text>
          <Text style={styles.point}>⭐Easy Message Setup </Text>
          <Text style={styles.point}>⭐Efficient Batch Delivery </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleGetStarted('NearByPromotion')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardBusiness}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitleBlue}>Categorywise Promotion</Text>

          <Image
            source={require('../src/assets/images/Catgeory.png')}
            style={styles.CWPimage}
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.point}>⭐ Citywide Company Promotion</Text>
          <Text style={styles.point}>⭐Targeted Smart Marketing</Text>
          <Text style={styles.point}>
            ⭐Find Buyers by Keyword, Send Instantly
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleGetStarted('CategoryWisePromotion')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* Favorites Promotion Card */}
      <View style={styles.cardFavorites}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitleRed}>Favorites</Text>
          <Image
            source={require('../src/assets/images/fav-Second.png')} // Make sure this image exists
            style={styles.favImage}
          />
        </View>

        <TouchableOpacity
          style={styles.favbutton}
          onPress={() => handleGetStarted('Favorites')}>
          <Text style={styles.favbuttonText}>View Your Favorites</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Branding */}
      <View style={styles.footer}>
        <Image
          source={require('../src/assets/images/CompanyLogo.png')} // Make sure this image exists
          style={styles.brandIcon}
        />
        {/* <Text style={styles.brandIcon}>💫</Text> */}
        <Text style={styles.footerText}>SignPost PhoneBook</Text>
      </View>
    </ScrollView>
  );
};

export default Promotions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 15,
    marginTop: 10,
  },
  cardGold: {
    backgroundColor: '#fde7b1',
    margin: 15,
    borderRadius: 10,
    padding: 15,
  },
  cardBusiness: {
    backgroundColor: '#e0f0ff',
    margin: 15,
    borderRadius: 10,
    padding: 15,
  },
  cardHeader: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardTitleBlue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0070d2',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  image: {
    width: 100,
    height: 100,
    position: 'absolute',
    right: 0,
    top: 0,
  },

  CWPimage: {
    width: 100,
    height: 70,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  cardContent: {
    marginBottom: 15,
  },
  point: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  button: {
    backgroundColor: '#e53935',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginVertical: 20,
  },

  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e53935',
  },
  cardFavorites: {
    backgroundColor: '#ffe0e9',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    height: 100,
  },
  cardTitleRed: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  favImage: {
    width: 90,
    height: 90,
    position: 'absolute',
    right: 0,
    top: -10,
  },
  favbutton: {
    backgroundColor: 'red',
    width: 170,
    paddingVertical: 5,
    borderRadius: 10,
    paddingStart: 10,
  },
  favbuttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    alignItems: 'center',
  },
  brandIcon: {
    width: 100,
    height: 30,
    margin: 10,
  },
});
