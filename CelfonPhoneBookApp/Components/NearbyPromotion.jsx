import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
  Modal,
} from 'react-native';
import axios from 'axios';
import {AuthContext} from './AuthContext';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Using Material Icons
import {BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

const NearbyPromotion = ({navigation}) => {
  const {user, userData} = useContext(AuthContext);
  // const [userData, setUserData] = useState("");
  const [pincodeInput, setPincodeInput] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [clrBtn, setClrBtn] = useState(false);
  const [datas, setData] = useState([]);
  const [showresults, setShowresults] = useState(false);
  const [noRecord, setNoRecord] = useState(false);
  const [selectedBusinesses, setSelectedBusinesses] = useState([]);
  const [selectedPrefix, setSelectedPrefix] = useState(null);
  const maxLength = 290;
  const batchSize = 10;
  const selectedNumbers = selectedBusinesses
    .slice(0, batchSize)
    .map(client => client.mobileno);
  const [customMessage, setCustomMessage] = useState(
    'I Saw Your Listing in SIGNPOST PHONE BOOK. I am Interested in your Products. Please Send Details/Call Me. (Sent Through Signpost PHONE BOOK)',
  );

  const [isExpanded, setIsExpanded] = useState(false);

  const [prefix, setPrefix] = useState('');
  const [loading, setLoading] = useState(false);
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
    }, []),
  );

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedBusinesses([]);
    } else {
      setSelectedBusinesses([...datas]); // Use the reference directly
    }
    setSelectAll(!selectAll);
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
        setData(jsonResponse.sort((a, b) => b.id - a.id));
      } else {
        Alert.alert('Unexpected response from server.');
      }
    } catch (error) {
      Alert.alert('Failed to load data: ' + error.message);
    }
  };

  useEffect(() => {
    if (!pincodeInput && !prefix) {
      fetchData(); // Fetch all data only if no filters are applied
    }
  }, [pincodeInput, prefix]);

  const fetchBusinesses = () => {
    if (!pincodeInput || !prefix) {
      Alert.alert('Please enter a valid pincode and select a prefix.');
      return;
    }

    setLoading(true);
    axios
      .get(
        `https://signpostphonebook.in/get_details_based_on_prefix_pincode.php?pincode=${pincodeInput}&prefix=${prefix}`,
      )
      .then(response => {
        if (response.data?.[0] === 'No records found.') {
          setNoRecord(true);
          setClrBtn(true);
          setData([]);
          setShowresults(false);
        } else {
          setData(response.data); // Keep only filtered data
          setShowresults(true);
          setClrBtn(true);
        }
      })
      .catch(error => console.error('Error fetching businesses:', error))
      .finally(() => setLoading(false));
  };

  const handleCheckboxChange = useCallback(item => {
    setSelectedBusinesses(prevSelected => {
      const isSelected = prevSelected.some(i => i.id === item.id);
      return isSelected
        ? prevSelected.filter(i => i.id !== item.id) // Remove if selected
        : [...prevSelected, item]; // Add if not selected
    });
  }, []);

  const clearItems = () => {
    setPincodeInput('');
    setPrefix('');
    setSelectedPrefix(null);
    setData([]); // Clear data instead of reloading all records
    setSelectAll(false);
    setSelectedBusinesses([]);
    setClrBtn(false);
    setShowresults(false);
    setNoRecord(false);
  };

  const sendBatchSMS = () => {
    if (selectedBusinesses.length === 0) {
      Alert.alert('No clients selected!');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];

    const postData = {
      user_name: userData.businessname || userData.person || 'Unknown',
      date: currentDate,
      pincode: pincodeInput.trim(),
      product: '',
      selected_prefix: prefix,
      selected_prefix: prefix,
      promotion_from: 'Nearby Promotion',
      selected_count: selectedBusinesses.length,
    };

    axios
      .post(
        'https://signpostphonebook.in/promotion_app/promotion_appliaction.php',
        postData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        console.log(response.data.Message);
        Alert.alert('Success', response.data.Message);
      })
      .catch(error => {
        console.error('Error sending data:', error);
        Alert.alert('Error', 'Failed to send promotion data.');
      });

    const selectedNumbers = selectedBusinesses.map(client => client.mobileno);
    const recipients = selectedNumbers.join(',');
    const smsUri = `sms:${recipients}?body=${encodeURIComponent(
      customMessage,
    )}`;

    Linking.openURL(smsUri).then(() => {
      // Clear all after sending
      setPincodeInput('');
      setPrefix('');
      setSelectedPrefix(null);
      setSelectedBusinesses([]);
      setSelectAll(false);
      setCustomMessage(
        'I Saw Your Listing in SIGNPOST PHONE BOOK. I am Interested in your Products. Please Send Details/Call Me. (Sent Through Signpost PHONE BOOK)',
      );
      setClrBtn(false);
      setShowresults(false);
      setNoRecord(false);
    });
  };

  console.log(prefix);
  return (
    <ScrollView style={styles.container}>
      {/* <LinearGradient colors={['#FF69B4', '#FFFFFF']} style={styles.header}>
        <View style={styles.headerTop}></View> */}
      {/* HEADER TITLE */}
      {/* <Text style={styles.headerTitle}>Nearby Promotion</Text>
      </LinearGradient> */}

      {/* INFO SECTION */}
      <View style={styles.contentContainer}>
        <View style={styles.accordionContainer}>
          {/* Accordion Header */}
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.accordionTitle}>
              How to Send messages to mobile users dealing in a specific
              product.
            </Text>
            <Icon
              name={isExpanded ? 'expand-less' : 'expand-more'}
              size={24}
              color="#333"
              style={styles.accordionIcon}
            />
          </TouchableOpacity>

          {/* Collapsible Content */}
          {isExpanded && (
            <View style={styles.accordionContent}>
              <Text style={styles.accordionBullet}>
                ● First edit / create message to be sent. Minimum 1 Count (145
                characters), Maximum 2 counts (290 characters)
              </Text>
              <Text style={styles.accordionBullet}>
                ● Select type of Recipient (Males / Females / Business Firms)
              </Text>
              <Text style={styles.accordionBullet}>
                ● Type Pincode Number of Targetted area for Promotion
              </Text>
              <Text style={styles.accordionBullet}>
                ● For error free delivery of messages, send in batches of 10
                nos. each time
              </Text>
            </View>
          )}
        </View>

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
        <Text style={styles.label}>Select Recipients Type:</Text>
        <View style={styles.recipientContainer}>
          {['Mr.', 'Ms.', 'M/s.'].map(item => (
            <TouchableOpacity key={item} onPress={() => setPrefix(item)}>
              <Text style={styles.radioText}>
                {prefix === item ? '🔘' : '⚪'} {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Enter Pincode:</Text>
        <TextInput
          style={styles.pincodeInput}
          keyboardType="numeric"
          maxLength={6}
          value={pincodeInput}
          onChangeText={setPincodeInput}
        />

        <Text style={styles.label}>Select All Recipients:</Text>
        <TouchableOpacity onPress={handleSelectAllChange}>
          <Text style={styles.radioText}>
            {selectAll ? '🔘' : '⚪'} Select All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={clrBtn ? clearItems : fetchBusinesses}
          style={styles.searchButton}>
          <Text style={styles.buttonText}>{clrBtn ? 'Clear' : 'Search'}</Text>
        </TouchableOpacity>

        {showresults && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              <Text style={styles.boldText}>Results Displayed:</Text>{' '}
              {datas.length}
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.boldText}>Selected:</Text>{' '}
              {selectedBusinesses.length}
            </Text>
          </View>
        )}

        {loading && <ActivityIndicator size="large" color="blue" />}

        {showresults && datas?.length > 0 && (
          <ScrollView style={styles.resultList} nestedScrollEnabled={true}>
            {datas.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleCheckboxChange(item)}
                style={[
                  styles.card,
                  selectedBusinesses.includes(item) && styles.selectedCard,
                ]}>
                <View style={styles.cardHeader}>
                  <Text
                    style={[
                      styles.cardTitle,
                      selectedBusinesses.includes(item) &&
                        styles.selectedCardTitle,
                    ]}>
                    {item.businessname || item.person}
                  </Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardText}>
                    📞 {item.mobileno.slice(0, -5)}xxxxx
                  </Text>
                </View>
                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    onPress={() => handleCheckboxChange(item)}
                    style={styles.checkboxContainer}>
                    <Text style={styles.checkbox}>
                      {selectedBusinesses.includes(item) ? '☑' : '☐'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity onPress={sendBatchSMS} style={styles.sendButton}>
          <Text style={styles.buttonText}>Send SMS</Text>
        </TouchableOpacity>

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
      </View>
    </ScrollView>
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

  //-------------
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

  label: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
    lineHeight: 25,
  },
  recipientContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
    marginTop: 10,
  },
  radioText: {
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#AA336A',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  searchButton: {backgroundColor: 'green', padding: 10, borderRadius: 5},
  buttonText: {color: 'white', textAlign: 'center'},
  pincodeInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginTop: 10,
  },
  resultText: {fontSize: 16, color: '#333'},
  boldText: {
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
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
  },

  cardText: {
    fontSize: 16,
    color: '#555',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  checkboxContainer: {
    padding: 5,
  },
  checkbox: {
    fontSize: 20,
    color: '#007BFF',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
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

export default NearbyPromotion;
