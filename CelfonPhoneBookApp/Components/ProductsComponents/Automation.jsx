import {
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Text,
  Alert,
  Linking,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import {useEffect, useState, useContext} from 'react';
import Skeleton from '../Skeleton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../AuthContext';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Automation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const searachProduct = 'automation';
  const [firmName, setFirmName] = useState('');
  const [productName, setProductName] = useState('');
  const {user, userData} = useContext(AuthContext);
  const navigation = useNavigation();
  const [favoriteModalVisible, setFavoriteModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');

  const [selectedItem, setSelectedItem] = useState('');

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

  const handleFavoritePress = () => {
    if (!user) {
      Alert.alert('Login Required', 'You need to log in to add to favorites.', [
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
      return;
    }
    setFavoriteModalVisible(true);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://signpostphonebook.in/client_fetch_product.php?product=${searachProduct}`,
      );
      if (!response.ok)
        throw new Error(`Http Error! Status: ${response.status}`);
      const jsonResponse = await response.json();
      if (Array.isArray(jsonResponse)) {
        const stroedData = jsonResponse.sort((a, b) => b.id - a.id);
        setData(stroedData);
      } else {
        Alert.alert('Error', 'Unexpected response from server.');
      }
    } catch (error) {
      console.log('Error, Failed to load data :' + error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  });

  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

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
              <Text style={styles.mobile}>
                {item.mobileno.slice(0, 5)}xxxxx
              </Text>
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
  };
  return (
    <View>
      <View style={styles.listContainer}>
        {loading ? (
          <Skeleton />
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}
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
                <TouchableOpacity
                  style={styles.sendSMSButton}
                  onPress={sendSMS}>
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
    </View>
  );
}

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

  //modal one

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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
  },
});
