import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  TextInput,
  Linking,
  ImageBackground,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AuthContext} from './AuthContext';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// playstore

const openPlayStoreLink = url => {
  Linking.openURL(url).catch(err => {
    console.error('Failed to open Play Store:', err);
  });
};

const {width} = Dimensions.get('window');

const categories = [
  {
    name: 'Automation',
    image: require('../src/assets/images/Automation.jpg'),
    route: 'Automation',
  },
  {
    name: 'Foundary',
    image: require('../src/assets/images/foundary.jpg'),
    route: 'Foundary',
  },
  {
    name: 'Machinary',
    image: require('../src/assets/images/Machinery.jpeg'),
    route: 'Machinery',
  },
  {
    name: 'CNC',
    image: require('../src/assets/images/modelcnc.jpeg'),
    route: 'CNC',
  },
  {
    name: 'Textiles',
    image: require('../src/assets/images/textiles.jpg'),
    route: 'Textiles',
  },
  {
    name: 'Fabrications',
    image: require('../src/assets/images/fabrication.jpg'),
    route: 'Fabrication',
  },
];

const companyNames = [
  {
    name: 'Janatics',
    logo: require('../src/assets/images/Janatics-logo.png'),
    color: '#f2f2f2',
  },
  {
    name: 'SunWater Supply',
    logo: require('../src/assets/images/ajith-logo.png'),
    color: '#f2f2f2',
  },
  {
    name: 'Ajith Associates',
    logo: require('../src/assets/images/ajith-logo.png'),
    color: '#f2f2f2',
  },
  {
    name: 'Fabtech',
    logo: require('../src/assets/images/fabtech-logo.png'),
    color: '#f2f2f2',
  },
  {
    name: 'Raison Automation',
    logo: require('../src/assets/images/Raison-logo.png'),
    color: '#f2f2f2',
  },
  {
    name: 'MKS Foods',
    logo: require('../src/assets/images/mks-foods.png'),
    color: '#f2f2f2',
  },
];

const Landingpage = () => {
  const {userData} = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const navigation = useNavigation();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://signpostphonebook.in/client_fetch_for_new_database.php',
        );
        const jsonResponse = await response.json();
        if (Array.isArray(jsonResponse)) {
          const sortedData = jsonResponse.sort((a, b) => b.id - a.id);
          setCompanies(sortedData);
        } else {
          Alert.alert('Error', 'Unexpected response from server.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load data: ' + error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!userData?.id) return;
      try {
        const response = await axios.get(
          `https://signpostphonebook.in/image_upload_for_new_database.php?id=${userData.id}`,
        );
        if (response.data.success) {
          const imageUrl = response.data.imageUrl;
          const fullUrl = imageUrl.startsWith('http')
            ? imageUrl
            : `https://signpostphonebook.in/${imageUrl}`;
          setProfileImage(`${fullUrl}?t=${new Date().getTime()}`);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, [userData?.id]);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#FF69B4", "#FFFFFF"]}>

      
      <View style={styles.carouselWrapper}>
        <Image
          // source={require('../src/assets/images/Clouds.png')}
          style={{width: '100%', height: 230, resizeMode: 'cover'}}
        />
        <View style={styles.overlayHeader}>
          <View style={styles.topRow}>
            <Text style={styles.welcomeText}>
              Welcome {userData.businessname || userData.person || 'Guest'}
            </Text>

            <TouchableOpacity
              style={styles.profileIconContainer}
              onPress={() => {
                if (userData?.id) {
                  navigation.navigate('Profile');
                } else {
                  Alert.alert(
                    'Login Required',
                    'You need to log in to view your Profile.',
                    [{text: 'OK', onPress: () => navigation.navigate('Login')}],
                  );
                }
              }}>
              {userData?.id && profileImage ? (
                <Image
                  source={{uri: profileImage}}
                  style={styles.profileIcon}
                  resizeMode="cover"
                />
              ) : (
                <MaterialIcons name="person" size={28} color="black" />
              )}
            </TouchableOpacity>
          </View>

          {/* Search Bar aligned below */}
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Firm/Product.."
              onFocus={() => navigation.navigate('FeauturedSearch')}
              style={styles.searchInput}
            />
            <Ionicons
              name="search-outline"
              size={20}
              color="#555"
              style={styles.searchIcon}
            />
          </View>

          <View style={styles.centeredTextWrapper}>
            <Text style={styles.centeredText}>Welcome to</Text>
            <Text style={styles.brandTitle}>Celfon5g</Text>
            <Text style={styles.tagline}>Empowering Industry</Text>
          </View>
        </View>
      </View>
      </LinearGradient>

      <View style={styles.bodyWrapper}>
        <View style={styles.gridWrapper}>
          <Text style={styles.sectionTitle}>Products</Text>
          <FlatList
            data={categories}
            numColumns={3}
            keyExtractor={(item, index) => item.name + index}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            contentContainerStyle={{paddingBottom: 20}}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => navigation.navigate(item.route)}
                style={styles.categoryItem}>
                <ImageBackground
                  source={item.image}
                  style={styles.categoryImage}
                  imageStyle={{borderRadius: 30}}
                />
                <Text style={styles.productName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.companiesSection}>
          <Text style={styles.sectionTitle}>Companies A - Z</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.alphabetScroller}>
            {Array.from({length: 26}, (_, i) =>
              String.fromCharCode(65 + i),
            ).map(letter => (
              <TouchableOpacity
                key={letter}
                style={styles.letterButton}
                onPress={() => {
                  const filtered = companies.filter(
                    company =>
                      company.businessname &&
                      company.businessname.charAt(0).toLowerCase() ===
                        letter.toLowerCase(),
                  );

                  navigation.navigate('AlphabeticalList', {
                    selectedLetter: letter,
                    filteredCompanies: filtered,
                  });
                }}>
                <Text style={styles.letterText}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.companiesGrid}>
            {companyNames.map((company, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.companyCard, {backgroundColor: company.color}]}
                onPress={() => {
                  const filtered = companies.filter(
                    c =>
                      c.businessname &&
                      c.businessname
                        .toLowerCase()
                        .includes(company.name.toLowerCase()),
                  );

                  if (filtered.length === 0) {
                    Alert.alert(
                      'Not Found',
                      `No listings found for "${company.name}"`,
                    );
                    return;
                  }

                  navigation.navigate('AlphabeticalList', {
                    selectedLetter: company.name[0].toUpperCase(),
                    filteredCompanies: filtered,
                    selectedBusinessName: company.name,
                  });
                }}>
                <Image source={company.logo} style={styles.logo} />
                <Text style={styles.companyName}>{company.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* books */}

        <View style={styles.booksCardRow}>
          {/* Book 1 */}
          <View style={styles.booksCardSmall}>
            <ImageBackground
              source={require('../src/assets/images/Book2024.jpg')}
              style={styles.booksImage}
              imageStyle={styles.booksImageRadius}>
              <View style={styles.booksBadge}>
                <Text style={styles.booksBadgeText}>1</Text>
              </View>
            </ImageBackground>
            <View style={styles.booksContent}>
              <Text style={styles.booksTitle}>Coimbatore 2024</Text>
              <Text style={styles.booksDescription}>
                This Coimbatore 2024 (21st Edition) Industrial Directory
              </Text>
              <TouchableOpacity
                style={styles.booksButton}
                onPress={() =>
                  openPlayStoreLink(
                    'https://play.google.com/store/books/details/Lion_Dr_Er_J_Shivakumaar_COIMBATORE_2024_Industria?id=kwgSEQAAQBAJ',
                  )
                }>
                <Text style={styles.booksButtonText}>Free Now</Text>
              </TouchableOpacity>
              {/* <Text style={styles.booksPrice}>40.0 INR</Text>
              <Text style={styles.booksOldPrice}>80</Text> */}
            </View>
          </View>

          {/* Book 2 */}
          <View style={styles.booksCardLarge}>
            <ImageBackground
              source={require('../src/assets/images/Book2025.jpg')}
              style={styles.booksImage}
              imageStyle={styles.booksImageRadius}>
              <View style={styles.booksBadge}>
                <Text style={styles.booksBadgeText}>2</Text>
              </View>
            </ImageBackground>
            <View style={styles.booksContent}>
              <Text style={styles.booksTitle}>Coimbatore 2025</Text>
              <Text style={styles.booksDescription}>
                This is a Preview Edition of Coimbatore 2025 Industrial
                Directory
              </Text>
              <TouchableOpacity
                style={styles.booksButton}
                onPress={() =>
                  openPlayStoreLink(
                    'https://play.google.com/store/books/details/Lion_Dr_Er_J_Shivakumaar_COIMBATORE_2025_Industria?id=sCE6EQAAQBAJ',
                  )
                }>
                <Text style={styles.booksButtonText}>Free trial</Text>
              </TouchableOpacity>
              {/* <Text style={styles.booksPrice}>40.0 INR</Text>
              <Text style={styles.booksOldPrice}>80.0 INR</Text> */}
            </View>
          </View>

          {/* Book 3 */}
          <View style={styles.booksCardSmall}>
            <ImageBackground
              source={require('../src/assets/images/FirstImage.jpg')}
              style={styles.booksImage}
              imageStyle={styles.booksImageRadius}>
              <View style={styles.booksBadge}>
                <Text style={styles.booksBadgeText}>3</Text>
              </View>
            </ImageBackground>
            <View style={styles.booksContent}>
              <Text style={styles.booksTitle}>Coimbatore 2026</Text>
              <Text style={styles.booksDescription}>
                This Coimbatore 2026 Directory Releasing soon ...
              </Text>
              <TouchableOpacity style={styles.booksButton}>
                <Text style={styles.booksButtonText}>Comming Soon</Text>
              </TouchableOpacity>
              {/* <Text style={styles.booksPrice}>00.0 INR</Text>
              <Text style={styles.booksOldPrice}>00</Text> */}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },

  profileIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overlayHeader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    paddingTop: 25,
    paddingHorizontal: 20,
  },

  centeredTextWrapper: {
    alignItems: 'center',
    marginTop: 1,
    lineHeight: 20,
  },

  centeredText: {
    fontSize: 16,

    fontWeight: '400',
    fontStyle: 'italic',
  },

  brandTitle: {
    fontSize: 28,

    fontWeight: '900',
    fontFamily: 'serif',
    letterSpacing: 2,
  },

  tagline: {
    fontSize: 14,

    marginTop: 4,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 14,
  },
  searchIcon: {
    marginLeft: 8,
  },

  bodyWrapper: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 12,
  },

  gridWrapper: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,

    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
    paddingLeft: 20,
    paddingTop: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginBottom: 10,
    width: '30%',
  },
  categoryImage: {
    width: 50,
    height: 50,
  },
  productName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#444',
  },

  //---coming companies---//

  companiesSection: {
    marginTop: 20,
    paddingBottom: 20,
  },

  alphabetScroller: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  letterButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  letterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },

  companiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  logo: {
    width: 35,
    height: 35,
    borderRadius: 55,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '00',
    flexShrink: 1,
  },

  //books

  booksCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 20,
  },
  booksCardSmall: {
    width: 110,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  booksCardLarge: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  booksImage: {
    width: '100%',
    height: 160,
    justifyContent: 'flex-start',
  },
  booksImageRadius: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  booksBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#f57c00',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  booksBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  booksContent: {
    padding: 8,
  },
  booksTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  booksDescription: {
    fontSize: 10,
    color: '#555',
    marginBottom: 6,
  },
  booksButton: {
    backgroundColor: '#ff5722',
    paddingVertical: 4,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 4,
  },
  booksButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  booksPrice: {
    color: '#e53935',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  booksOldPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Landingpage;
