import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  Linking,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from './AuthContext';
import axios from 'axios';
import Skeleton from './Skeleton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SearchModal = route => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firmName, setFirmName] = useState('');
  const [productName, setProductName] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [activeInput, setActiveInput] = useState(null);

  const {user, userData} = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const [message, setMessage] = useState('');

  const [favoriteModalVisible, setFavoriteModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (modalVisible && selectedItem) {
      setMessage(
        `Dear ${
          selectedItem.businessname || selectedItem.person
        }, We refer to your Business Listing in Signpost PHONEBOOOK, Mobile App. We are intersted in your Products. Please send Details. Call me 
        Regards ${userData.businessname || userData.person}
        ${userData.mobileno || userData.email}`,
      );
    }
  }, [modalVisible, selectedItem]);

  const handleFavoritePress = () => {
    if (!user) {
      Alert.alert('Login Required', 'You need to log in to add to favorites.', [
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
      return;
    }
    setFavoriteModalVisible(true);
  };

  const toggleCategory = category => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category],
    );
  };

  const handleSaveFavorite = async () => {
    if (!selectedItem || selectedCategories.length === 0) return;

    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      let currentFavorites = storedFavorites
        ? JSON.parse(storedFavorites)
        : {Supplier: [], Buyer: [], Firms: []};

      selectedCategories.forEach(category => {
        // Ensure we save all necessary details for proper display
        const fullItem = {
          id: selectedItem.id,
          businessname: selectedItem.businessname || '',
          person: selectedItem.person || '',
          product: selectedItem.product || '',
          city: selectedItem.city || '',
          pincode: selectedItem.pincode || '',
          mobileno: selectedItem.mobileno || '',
        };

        if (
          !currentFavorites[category].some(item => item.id === selectedItem.id)
        ) {
          currentFavorites[category].push(fullItem);
        }
      });

      await AsyncStorage.setItem('favorites', JSON.stringify(currentFavorites));
      console.log('Saved:', currentFavorites);

      // Close modal
      setFavoriteModalVisible(false);

      // Show success message
      Alert.alert('Success', 'Added to My List successfully!');
    } catch (error) {
      console.error('Error saving favorite:', error);
    }
  };

  const handleEnquiryPress = item => {
    if (!user) {
      Alert.alert('Login Required', 'You need to log in to send an enquiry.', [
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
      return;
    }
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleAction = url => {
    Linking.openURL(url);
    setTimeout(() => {
      setModalVisible(false); // Close the modal after redirection
    }, 1000); // Adjust delay if needed
  };

  const sendSMS = () => {
    if (selectedItem?.mobileno) {
      handleAction(
        `sms:${selectedItem.mobileno}?body=${encodeURIComponent(message)}`,
      );
    }
  };

  const sendWhatsApp = () => {
    if (selectedItem?.mobileno) {
      handleAction(
        `https://wa.me/${selectedItem.mobileno}?text=${encodeURIComponent(
          message,
        )}`,
      );
    }
  };

  const sendEmail = () => {
    if (selectedItem?.email) {
      handleAction(
        `mailto:${selectedItem.email}?subject=Enquiry&body=${encodeURIComponent(
          message,
        )}`,
      );
    }
  };

  useEffect(() => {
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
          setProfileImage(fullUrl + `?t=${new Date().getTime()}`); // Prevent caching
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, [userData?.id]);


  

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://signpostphonebook.in/client_fetch_for_new_database.php',
      );
      if (!response.ok)
        throw new Error(`HTTP Error! Status: ${response.status}`);
      const jsonResponse = await response.json();
      if (Array.isArray(jsonResponse)) {
        const sortedData = jsonResponse.sort((a, b) => b.id - a.id);
        setData(sortedData);
        setFilteredData(sortedData);
      } else {
        Alert.alert('Error', 'Unexpected response from server.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Filter data based on search input
  useEffect(() => {
    let filtered = data;
    if (firmName) {
      filtered = data.filter(item =>
        item.businessname?.toLowerCase().includes(firmName.toLowerCase()),
      );
    } else if (productName) {
      filtered = data.filter(item =>
        item.product?.toLowerCase().includes(productName.toLowerCase()),
      );
    }
    setFilteredData(filtered);
  }, [firmName, productName, data]);

  // Function to handle navigation to details screen

  const renderItem = ({item}) => {
    
    const handleMorePress = item => {
      if (user) {
        navigation.navigate('Details', {selectedItem: item});
      } else {
        Alert.alert(
          'Login Required',
          'You need to log in to View the details.',
          [{text: 'OK', onPress: () => navigation.navigate('Login')}],
        );
      }
    };

    const openDialpad = dialedNumber => {
      if (!user || user === '') {
        Alert.alert('Login Required', 'You need to log in to make a call.', [
          {text: 'OK', onPress: () => navigation.navigate('Login')},
        ]);
        return;
      }

      const phoneUrl = `tel:${dialedNumber}`;

      Linking.openURL(phoneUrl).catch(err => {
        console.error('An error occurred', err);
        Alert.alert('Error', 'Dial pad not supported on this device.');
      });
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleMorePress(item)}
        activeOpacity={0.7}>
        <View style={styles.cardRow}>
          {/* Dial Button at Start */}
          <TouchableOpacity
            style={styles.dialButton}
            onPress={e => {
              e.stopPropagation();
              openDialpad(item.mobileno);
            }}>
            <Icon name="call" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.dailheartButton}
              onPress={() => handleFavoritePress()}>
              <MaterialIcons name="favorite-border" size={20} color="red" />
            </TouchableOpacity>




          <View style={styles.textContainer}>
            <Text style={styles.businessName}>
              {firmName &&
              item.person.toLowerCase().includes(firmName.toLowerCase())
                ? toTitleCase(item.person)
                : toTitleCase(
                    item.businessname ? item.businessname : item.person,
                  )}
            </Text>

            {productName && (
              <Text style={styles.productName}>{item.product}</Text>
            )}

            {!productName && item.city && item.pincode && (
              <Text style={styles.locationText}>
                {item.city}, {item.pincode}
              </Text>
            )}

            {/* Mobile Number Below Product & Location */}
            {item.mobileno && (
              <Text style={styles.mobile}>
                {item.mobileno.slice(0, 5)}xxxxx
              </Text>
            )}
          </View>

          <View style={styles.rightContainer}>
            {/* Heart Button (Favorite) */}

            {/* suppiler, Buyer, Firms */}

            {/* <TouchableOpacity
              style={styles.heartButton}
              onPress={() => handleFavoritePress()}>
              <MaterialIcons name="favorite-border" size={20} color="red" />
            </TouchableOpacity> */}

            {/* Enquiry Button */}
            <TouchableOpacity
              style={styles.enquirybutton}
              onPress={() => handleEnquiryPress(item)}>
              <Text style={styles.enqbuttonText}>?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  //colors={['#FFD700', '#FFB800']}

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={['#FF69B4', '#FFFFFF']} style={styles.header}>
        {/* <View style={styles.headerTop}>
          <Text style={styles.welcomeText}>
            Welcome {userData.businessname || userData.person || 'Guest'}
          </Text> */}

          {/* <View style={styles.iconGroup}> */}
            {/* /* Favorite (Heart) Icon */}
            {/* <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                if (userData?.id) {
                  navigation.navigate('Mylist'); // Navigate to Favorites if logged in
                } else {
                  Alert.alert(
                    'Login Required',
                    'You need to log in to view your My Lists.',
                    [{text: 'OK', onPress: () => navigation.navigate('Login')}],
                  );
                }
              }}>
              <MaterialIcons name="favorite" size={24} color="red" />
            </TouchableOpacity> */}

            {/* Notification Icon */}
            {/* </LinearGradient><MaterialIcons name="notifications-none" size={24} color="#000" /> */}

            {/* Profile Icon */}
            {/* <TouchableOpacity
              style={styles.profileIconContainer}
              onPress={() => {
                if (userData?.id) {
                  navigation.navigate('Profile'); // Navigate to Profile if logged in
                }  else {
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
        </View> */}

        {/* SEARCH INPUT */}
        <View style={styles.searchBarContainer}>
          <TouchableOpacity
            style={[
              styles.inputBox,
              activeInput === 'first' ? styles.expanded : styles.shrunken,
            ]}
            onPress={() => setActiveInput('first')}>
            <TextInput
              placeholder="Search by Firms/Person"
              style={styles.searchInput}
              value={firmName}
              onChangeText={setFirmName}
              onFocus={() => {
                setActiveInput('first');
                setProductName('');
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.inputBox,
              activeInput === 'second' ? styles.expanded : styles.shrunken,
            ]}
            onPress={() => setActiveInput('second')}>
            <TextInput
              placeholder="Search by product"
              style={styles.searchInput}
              value={productName}
              onChangeText={setProductName}
              onFocus={() => {
                setActiveInput('second');
                setFirmName('');
              }}
            />
          </TouchableOpacity>
        </View>

        {/* HEADER CONTENT */}
        <View>
          <Text style={styles.headercontent}>Find Anyone, Anytime</Text>
          <Text style={styles.headersub}>
            Discover your customers near by you, Attract them with your offers &
            Discounts.
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.listContainer}>
        {loading ? (
          <Skeleton />
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* First modal */}

      <Modal visible={modalVisible} animationType="slide" transparent>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      {/* Close button at the top-right */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setModalVisible(false)}>
        <MaterialIcons name="close" size={24} />
      </TouchableOpacity>

      <Text style={styles.modalTitle}>
      <MaterialIcons name="edit" size={20} />
        Edit Content{"\n"}to Send Enquiry to {selectedItem?.businessname || selectedItem?.person}
      </Text>

       

      <TextInput
        style={styles.input}
        placeholder="Enter your message..."
        value={message}
        onChangeText={setMessage} // Allows editing
        multiline
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.sendSMSButton} onPress={sendSMS}>
        <MaterialIcons  style={styles.buttonText} name="sms" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendwhatButton} onPress={sendWhatsApp}>
        <FontAwesome style={styles.buttonText} name="whatsapp" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendMailButton} onPress={sendEmail}>
        <MaterialIcons  style={styles.buttonText} name="mail" size={24} color="red" />

        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


      {/* Second modal */}

      <Modal
        visible={favoriteModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFavoriteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {/* Close Button (X) */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFavoriteModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalHeading}>Add to Favorites</Text>

            {['Supplier', 'Buyer', 'Firms'].map(category => (
              <TouchableOpacity
                key={category}
                style={styles.checkboxRow}
                onPress={() => toggleCategory(category)}>
                <MaterialIcons
                  name={
                    selectedCategories.includes(category)
                      ? 'check-box'
                      : 'check-box-outline-blank'
                  }
                  size={24}
                  color="red"
                />
                <Text style={styles.checkboxLabel}>{category}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.confirmButton,
                selectedCategories.length === 0 && styles.disabledButton,
              ]}
              onPress={handleSaveFavorite}
              disabled={selectedCategories.length === 0}>
              <Text style={styles.confirmButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  //Linear Gradient kulla irrukura items ku styles

  header: {
    padding: 20,
    paddingTop: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  inputBox: {
    height: 40,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  searchInput: {
    fontSize: 16,
    padding: 5,
    height: '100%',
    width: '100%',
  },
  expanded: {
    width: '80%',
    transition: 'width 0.2s ease-in-out',
  },
  shrunken: {
    width: '20%',
    transition: 'width 0.2s ease-in-out',
  },
  headercontent: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 5,
  },
  headersub: {
    textAlign: 'center',
    marginTop: 5,
  },

  //Profile icon ku styles

  profileIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Light gray background for icon style
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 90, // Circular profile image
    zIndex: 1,
  },

  //card styles

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  businessName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    color: '#444',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  rightContainer: {
    alignItems: 'center',
    justifyContent: 'center', // Aligns heart & enquiry button
  },
  mobile: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  enquirybutton: {
    backgroundColor: '#008000',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 8, // Replaces absolute positioning
    display:'flex',
    justifyContent:"flex-end",
    alignItems:"flex-end",
    position: 'relative',
    top: 20, // Aligns enquiry button with heart button
     
  },
  heartButton: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
    left: 40, // Aligns heart button with enquiry button
    bottom: 0, // Aligns heart button with enquiry button
    marginBottom: 5, // Space between heart & enquiry button
  },
  enqbuttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  dialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF', // Blue color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'relative',
    top: -20, // Adjusts position of dial button
  },

  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  inputContainer: {flexDirection: 'row', padding: 10},
  input: {flex: 1, borderWidth: 1, borderRadius: 5, padding: 10, margin: 5},

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sendSMSButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    margin: 5,
  },
  sendwhatButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    margin: 5,
  },
  sendMailButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    margin: 5,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  //second modal

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: '#444',
  },
  confirmButton: {
    marginTop: 15,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  

  //fav

  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    // backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
    color: '#fff',
    padding: 8,
  },

  editContainer: {
    flexDirection: 'row',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  editText: {
    fontSize: 16,
    marginRight: 5,
    color: '#333',
    fontWeight: '900',
  },


  dailheartButton:{
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    left: 5, // Aligns heart button with enquiry button
    bottom: -8 , // Aligns heart button with enquiry button
    // marginBottom: 5, // Space between heart & enquiry button
  },
});

export default SearchModal;
