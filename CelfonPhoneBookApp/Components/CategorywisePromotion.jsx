import React, {useEffect, useState, useContext,useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  Platform,
  Alert,
  Linking,
  Button,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Using Material Icons

import {AuthContext} from './AuthContext';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {BackHandler} from 'react-native';

const CategoryPromotionScreen = ({navigation}) => {
  const {user, userData} = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [productInput, setProductInput] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showresults, setShowresults] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0); // Track selected count
  const maxLength = 290;
  const [customMessage, setCustomMessage] = useState(
    'I Saw Your Listing in SIGNPOST PHONE BOOK. I am Interested in your Products. Please Send Details/Call Me. (Sent Through Signpost PHONE BOOK)',
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);


   useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          setShowCancelModal(true);
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          onBackPress,
        );
    
        return () => backHandler.remove(); // Properly cleanup
      }, [])
    );


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


  // Fetch filtered product data
  const fetchProductData = async name => {
    if (!name) return;
    try {
      const response = await fetch(
        `https://signpostphonebook.in/client_fetch_product.php?product=${name}`,
      );
      if (!response.ok)
        throw new Error(`HTTP Error! Status: ${response.status}`);

      const jsonResponse = await response.json();
      if (Array.isArray(jsonResponse)) {
        setData(jsonResponse);
      } else {
        Alert.alert('Error', 'Unexpected response from server.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load product data: ' + error.message);
    }
  };

  const handleSearch = e => {
    e.preventDefault();
  
    if (productInput && productInput.trim() !== '') {
      fetchProductData(productInput);
      setShowresults(true);
    } else{
      Alert.alert("Enter Product Name To search")
    }
  };

  const handleClear = () => {
    setProductInput('');

    setSelectAll(false);
    setSelectedClients([]); // Clear selected clients
    setSelectedCount(0); // Reset selected count
    setShowresults(false);
    setData([]); // Clear data (remove cards)
  };

  const handleCheckboxChange = client => {
    setSelectedClients(prev =>
      prev.includes(client)
        ? prev.filter(item => item !== client)
        : [...prev, client],
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedClients([]);
    } else {
      setSelectedClients(data);
    }
    setSelectAll(!selectAll);
  };

  const sendSMS = () => { 
    if (selectedClients.length === 0) {
      Alert.alert('No clients selected!');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];

    const postData = {
      user_name: userData.businessname || userData.person || 'Unknown',
      date: currentDate,
      pincode: '',
      product: productInput.trim(),
      selected_prefix:"NA",
      selected_prefix: "NA",
      product: productInput.trim(),      
      promotion_from: 'CategoryWise Promotion',
      selected_count: selectedClients.length,
    };

    axios
      .post(
        'https://signpostphonebook.in/promotion_app/promotion_appliaction.php',
        postData,
      )
      .then(response => {
        console.log(response.data.Message);
      })
      .catch(error => console.error('Error sending data:', error));

    const mobileNumbers = selectedClients.map(client => client.mobileno);

    if (mobileNumbers.length === 0) {
      Alert.alert('Error', 'No valid mobile numbers found.');
      return;
    }

    const recipients = mobileNumbers.join(',');
    const smsUri = `sms:${recipients}?body=${encodeURIComponent(
      customMessage,
    )}`;

    Linking.openURL(smsUri).catch(err => {
      console.error('Error opening SMS application:', err);
      Alert.alert('Error', 'An error occurred while opening the SMS app.');
    });
  };

  return (
    <>
      <FlatList
        ListHeaderComponent={
          <View style={styles.contentContainer}>
            {/* Accordion */}
            <View style={styles.accordionContainer}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => setIsExpanded(!isExpanded)}>
                <Text style={styles.accordionTitle}>
                  How to Send messages to mobile users dealing in a specific product.
                </Text>
                <Icon
                  name={isExpanded ? 'expand-less' : 'expand-more'}
                  size={24}
                  color="#333"
                  style={styles.accordionIcon}
                />
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.accordionContent}>
                  <Text style={styles.accordionBullet}>
                    ● First edit / create message to be sent. Minimum 1 Count (145 characters), Maximum 2 counts (290 characters)
                  </Text>
                  <Text style={styles.accordionBullet}>● Type specific Category / product / keyword</Text>
                  <Text style={styles.accordionBullet}>
                    ● For error-free delivery of messages, send in batches of 10 each time.
                  </Text>
                </View>
              )}
            </View>

            {/* Message Input */}
            <Text style={styles.inputLabel}>Edit / Create Message:</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message here..."
              value={customMessage}
              onChangeText={setCustomMessage}
              multiline
              maxLength={maxLength}
            />
            <Text style={styles.charCount}>
              {maxLength - customMessage.length} / {maxLength}
            </Text>

            <Text style={styles.inputLabel}>Category:</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Type product name..."
              value={productInput}
              onChangeText={setProductInput}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={handleSearch}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
              {data.length > 0 && (
                <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                  <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {data.length > 0 && (
              <>
                <TouchableOpacity style={styles.button} onPress={sendSMS}>
                  <Text style={styles.buttonText}>Send SMS</Text>
                </TouchableOpacity>

                <Text style={styles.resultCount}>
                  <Text style={{fontWeight: 'bold'}}>Results Displayed:</Text> {data.length}
                </Text>

                {selectedClients.length > 0 && (
                  <Text style={styles.resultCount}>
                    <Text style={{fontWeight: 'bold'}}>Selected:</Text> {selectedClients.length}
                  </Text>
                )}

                <View style={styles.checkboxRow}>
                  <Text style={styles.checkboxLabel}>Select All</Text>
                  <TouchableOpacity onPress={handleSelectAllChange}>
                    <Text style={styles.checkbox}>{selectAll ? '☑' : '☐'}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        }
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.businessname}</Text>
            <Text>{item.product}</Text>
            <View style={styles.checkboxRow}>
              <Text>{item.mobileno.slice(0, -5)}xxxxx</Text>
              <TouchableOpacity onPress={() => handleCheckboxChange(item)}>
                <Text style={styles.checkbox}>
                  {selectedClients.includes(item) ? '☑' : '☐'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          data.length > 0 && (
            <TouchableOpacity style={styles.button} onPress={sendSMS}>
              <Text style={styles.buttonText}>Send SMS</Text>
            </TouchableOpacity>
          )
        }
      />

      {/* Cancel Modal */}
      <Modal visible={showCancelModal} transparent animationType="fade">
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Cancel Confirmation</Text>
                      <Text
                        style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>
                        Are you sure you want to go back?
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Button
                          title="Stay"
                          onPress={() => setShowCancelModal(false)}
                        />
                        <Button
                          title="Go Back"
                          onPress={() => {
                            setShowCancelModal(false);
                            if (navigation.canGoBack()) {
                              navigation.goBack();
                            } else {
                              navigation.navigate('Home'); // or any safe fallback screen
                            }
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </Modal>
    </>
  );
};

const styles = StyleSheet.create({

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  //...
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 30 : 50,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 25,   
    fontWeight: 'bold',
    color: '#AA336A',
    textAlign: 'center',
    marginTop: 10,
  },

  infoBox: {
    backgroundColor: '#FAF3FF',
    padding: 22,
    borderRadius: 10,
    marginBottom: 1,
    borderWidth: 1,
    borderColor: '#E6C8FF',
  },
  infoText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 8,
  },
  bulletText: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 5,
    lineHeight: 22,
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  contentContainer: {
    padding: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#DC3545',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCount: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 10,
    marginBottom: 10,
  },

  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  checkbox: {
    fontSize: 20,
    color: '#007BFF',
  },

  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#ff0000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    fontSize: 20,
    color: '#007BFF',
  },

  accordionContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 8,
  },
  accordionIcon: {
    marginLeft: -25, // Spacing for the icon
    marginTop: 20,
  },
  accordionContent: {
    backgroundColor: '#FAF3FF',
    padding: 10,
  },
  accordionText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 8,
  },
  accordionBullet: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 5,
    lineHeight: 22,
  },
});

export default CategoryPromotionScreen;
