import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from './AuthContext';

const {width} = Dimensions.get('window');

const bannerData = [
  {
    title: 'Become a Media Partner',
    subtitle: 'Join and promote your services effectively',
  },
  {
    title: 'Expand Your Reach',
    subtitle: 'Register to get verified and grow your business',
  },
];

const MediaPartner = () => {
  const navigation = useNavigation();
  const {user} = useContext(AuthContext);

  const handleProtectedRoute = routeName => {
    if (user) {
      navigation.navigate(routeName);
    } else {
      Alert.alert('You need to Login to access this feature');
      navigation.navigate('Login');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.gradientWrapper}>
        <LinearGradient
          colors={['#a1c4fd', '#c2e9fb']}

          style={styles.gradientBackground}>
          <View style={styles.carouselWrapper}>
            <Carousel
              loop
              width={width}
              height={250}
              autoPlay
              scrollAnimationDuration={5000}
              data={bannerData}
              renderItem={({item}) => (
                <View style={styles.carouselItem}>
                  <Text style={styles.carouselTitle}>{item.title}</Text>
                  <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => handleProtectedRoute('AddPeople')}>
                    <Text style={styles.primaryButtonText}>Apply Now</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </LinearGradient>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Register</Text>
        <Text style={styles.infoDescription}>
          Register here with your Mobile Number, Name, Business Details,
          Location, and Product/Service to become a verified Media Partner.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => handleProtectedRoute('AddPeople')}>
          <Text style={styles.primaryButtonText}>ADD People</Text>
        </TouchableOpacity>
      </View>

      {/* Advance Order Booking */}
      <View style={styles.cardContainer}>
        <View style={{flex: 1}}>
          <Text style={styles.cardTitle}>Advance Order Booking</Text>
          <Text style={styles.cardSubtitle}>
            Book your ads in advance and plan ahead efficiently
          </Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => handleProtectedRoute('AdBooking')}>
            <Text style={styles.cardButtonText}>Coming Soon</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../src/assets/images/adv.png')} // ✅ Add this image
          style={styles.cardImage}
        />
      </View>

      {/* Subscription Booking */}
      <View style={styles.SubcardContainer}>
        <View style={{flex: 1}}>
          <Text style={styles.cardTitle}>Subscription Booking</Text>
          <Text style={styles.cardSubtitle}>
            Choose a subscription plan that suits your media goals
          </Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => handleProtectedRoute('Subscription')}>
            <Text style={styles.cardButtonText}>See Plans</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../src/assets/images/subscription.png')} // ✅ Add this image
          style={styles.cardImage}
        />
      </View>

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

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},

  gradientBackground: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  carouselItem: {
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: 'center',
    // backgroundColor: "#ccc",
  },

  carouselTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    textAlign: 'center',
  },

  carouselSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },

  primaryButton: {
    backgroundColor: '#d60000',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },

  infoSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.0,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },

  infoDescription: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    textAlign: 'center',
  },

  infoImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 15,
  },

  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  SubcardContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
    textAlign: 'center',
  },

  cardSubtitle: {
    fontSize: 13,
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },

  cardButton: {
    backgroundColor: '#d60000',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignItems: 'center',
  },

  cardButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },

  cardImage: {
    width: 80,
    height: 80,
    marginLeft: 15,
    resizeMode: 'contain',
  },
  footer: {
    alignItems: 'center',
    marginVertical: 50,
  },

  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e53935',
  },
  brandIcon: {
    width: 100,
    height: 30,
    margin: 10,
  },
  gradientWrapper: {
    width: '100%',
  },

  gradientBackground: {
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  carouselWrapper: {
    paddingTop: 50,
  },
});

export default MediaPartner;
