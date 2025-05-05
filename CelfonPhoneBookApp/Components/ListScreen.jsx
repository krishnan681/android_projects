import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AuthContext} from './AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ListScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {user, userData} = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [favoriteModalVisible, setFavoriteModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [message, setMessage] = useState('');

  const [data, setData] = useState([]);
  const [firmName, setFirmName] = useState('');
  const [productName, setProductName] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    if (route.params?.firmName) {
      setFirmName(route.params.firmName);
      setSearchQuery(route.params.firmName);
    }
    if (route.params?.productName) {
      setProductName(route.params.productName);
      setSearchQuery(route.params.productName);
    }
  }, [route.params]);

  useEffect(() => {
    let filtered = data;
    if (searchQuery) {
      filtered = data.filter(
        item =>
          item.businessname
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.product?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    setFilteredData(filtered);
  }, [searchQuery, data]);

  useEffect(() => {
    if (route.params?.firmName) setFirmName(route.params.firmName);
    if (route.params?.productName) setProductName(route.params.productName);
  }, [route.params]);

  useEffect(() => {
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

    fetchData();
  }, []);

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

  const toTitleCase = str =>
    str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const openDialpad = dialedNumber => {
    if (!user) {
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

  const handleMorePress = item => {
    if (user) {
      navigation.navigate('Details', {selectedItem: item});
    } else {
      Alert.alert('Login Required', 'You need to log in to View the details.', [
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
    }
  };

  const handleFavoritePress = () => {
    if (!user) {
      Alert.alert('Login Required', 'You need to log in to add to favorites.', [
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
      return;
    }
    setFavoriteModalVisible(true);
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

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleMorePress(item)}
      activeOpacity={0.7}>
      <View style={styles.cardRow}>
        <View style={styles.leftButtonContainer}>
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
            onPress={handleFavoritePress}>
            <MaterialIcons name="favorite-border" size={20} color="red" />
          </TouchableOpacity>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.businessName}>
            {firmName &&
            item.person.toLowerCase().includes(firmName.toLowerCase())
              ? toTitleCase(item.person)
              : toTitleCase(item.businessname || item.person)}
          </Text>

          {productName && (
            <Text style={styles.productName}>{item.product}</Text>
          )}

          {!productName && item.city && item.pincode && (
            <Text style={styles.locationText}>
              {item.city}, {item.pincode}
            </Text>
          )}

          {item.mobileno && (
            <Text style={styles.mobile}>{item.mobileno.slice(0, 5)}xxxxx</Text>
          )}
        </View>

        <View style={styles.rightContainer}>
          <TouchableOpacity
            style={styles.enquirybutton}
            onPress={() => handleEnquiryPress(item)}>
            <Text style={styles.enqbuttonText}>?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <TextInput
        style={styles.input}
        placeholder="Search by firm or product"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1aa0dc" />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
        />
      )}

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
              Edit Content{'\n'}to Send Enquiry to{' '}
              {selectedItem?.businessname || selectedItem?.person}
            </Text>

            <TextInput
              style={styles.firstmodalinput}
              placeholder="Enter your message..."
              value={message}
              onChangeText={setMessage} // Allows editing
              multiline
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.sendSMSButton} onPress={sendSMS}>
                <MaterialIcons
                  style={styles.buttonText}
                  name="sms"
                  size={24}
                  color="red"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendwhatButton}
                onPress={sendWhatsApp}>
                <FontAwesome
                  style={styles.buttonText}
                  name="whatsapp"
                  size={24}
                  color="green"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendMailButton}
                onPress={sendEmail}>
                <MaterialIcons
                  style={styles.buttonText}
                  name="mail"
                  size={24}
                  color="red"
                />
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 12,
    padding: 12,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  productName: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  mobile: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  enquirybutton: {
    backgroundColor: 'green',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enqbuttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  leftButtonContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  dialButton: {
    backgroundColor: '#007AFF',
    borderRadius: 30,
    padding: 10,
    marginBottom: 8,
  },
  dailheartButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },

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
  firstmodalinput: {
    width: '100%',
    height: 130,
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
    color: '#333',

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

  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    paddingHorizontal: 10,
  },
});

export default ListScreen;
