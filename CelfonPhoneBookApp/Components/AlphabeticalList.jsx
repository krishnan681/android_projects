import React, {useContext, useEffect, useState} from 'react';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AuthContext, AuthProvider} from './AuthContext';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AlphabeticalList = ({route}) => {
  const {selectedLetter, filteredCompanies, selectedBusinessName} = route.params;
  const [firmName, setFirmName] = useState(selectedBusinessName || '');
  const [productName, setProductName] = useState('');
  const {user, userData} = useContext(AuthContext);
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');


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

  const handleMorePress = item => {
    if (user) {
      navigation.navigate('Details', {selectedItem: item});
    } else {
      Alert.alert('Login Required', 'You need to log in to View the details.', [
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
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

  useEffect(() => {
    fetchData();
  }, []);

  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <View style={styles.container}>
      {!firmName ? (
  <Text style={styles.title}>
    Companies,Persons,Industries,etc.. starting with "{selectedLetter}"
  </Text>
) : null}

      <FlatList
       data={
        firmName
          ? filteredCompanies.filter(item =>
              item.businessname
                ?.toLowerCase()
                .includes(firmName.toLowerCase())
            )
          : filteredCompanies
      }
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      renderItem={({item}) => (
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
        )}
      />
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
              style={styles.input}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    padding: 20,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },

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
    justifyContent: 'center',
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
    marginTop: 8,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'relative',
    top: 20,
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
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'relative',
    top: -20,
  },
  dailheartButton: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    left: 5, // Aligns heart button with enquiry button
    bottom: -8, // Aligns heart button with enquiry button
    // marginBottom: 5, // Space between heart & enquiry button
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

  //first modal

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

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
  },
});

export default AlphabeticalList;
