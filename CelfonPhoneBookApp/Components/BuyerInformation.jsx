import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Linking,
  Dimensions,
} from 'react-native';
import {AuthContext} from './AuthContext';
import * as Animatable from 'react-native-animatable';

const BuyerInformation = () => {
  const {userData} = useContext(AuthContext);
  const [buyerId, setBuyerId] = useState('');
  const [buyerMobile, setBuyerMobile] = useState('');
  const [buyerList, setBuyerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [companies, setCompanies] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState('');
  const [emojiVisible, setEmojiVisible] = useState(false);

  const userId = userData?.id || '';
  const userName = userData?.businessname || userData?.person || 'Guest';

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
          showToast('Unexpected response from server');
        }
      } catch (error) {
        showToast('Failed to load data: ' + error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (buyerId) {
      const match = companies.find(c => String(c.id) === String(buyerId));
      if (match) {
        setBuyerMobile(match.mobileno || '');
        setSelectedItem(match);
      } else {
        setBuyerMobile('');
        setSelectedItem(null);
      }
    } else {
      setBuyerMobile('');
      setSelectedItem(null);
    }
  }, [buyerId, companies]);

  useEffect(() => {
    if (selectedItem && userData) {
      const newMessage = `Dear ${
        selectedItem.businessname || selectedItem.person
      }, We refer to your Business Listing in Signpost PHONEBOOK, Mobile App. We are interested in your Products. Please send Details. Call me 
          Regards ${userData.businessname || userData.person}
          ${userData.mobileno || userData.email}`;
      setMessage(newMessage);
    }
  }, [selectedItem]);

  const showToast = text => {
    setToast(text);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddBuyer = async () => {
    if (!buyerId || !buyerMobile) {
      showToast('Enter a valid Buyer ID first');
      return;
    }

    if (buyerList.some(item => item.buyerId === buyerId)) {
      showToast('This Buyer ID is already added in your session.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://signpostphonebook.in/icecream/information.php',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            user_id: userId,
            user_name: userName,
            buyer_id: buyerId,
            date: new Date().toISOString().slice(0, 10),
          }),
        },
      );
      const result = await response.json();

      if (!result.success) {
        if (result.message.includes('Duplicate')) {
          showToast('This buyer has already been added.');
        } else {
          showToast(result.message);
        }
        setLoading(false);
        return;
      }

      const updatedList = [...buyerList, {buyerId, buyerMobile}];
      setBuyerList(updatedList);
      setBuyerId('');
      setBuyerMobile('');
      setLoading(false);
    } catch (error) {
      showToast('Something went wrong: ' + error.message);
      setLoading(false);
    }
  };

  const handleRemoveBuyer = idToRemove => {
    const updatedList = buyerList.filter(b => b.buyerId !== idToRemove);
    setBuyerList(updatedList);
  };

  const handleSubmitAndSendSMS = () => {
    if (buyerList.length === 0) {
      showToast('Please add at least one Buyer ID');
      return;
    }

    const mobileNumbers = buyerList
      .map(b => b.buyerMobile)
      .filter(Boolean)
      .join(',');

    const smsUrl = `sms:${mobileNumbers}?body=${encodeURIComponent(message)}`;

    Linking.openURL(smsUrl)
      .then(() => {
        // Show emoji burst 🎉
        setEmojiVisible(true);
        setTimeout(() => setEmojiVisible(false), 1500);

        // Clear all states
        setBuyerId('');
        setBuyerMobile('');
        setBuyerList([]);
        setMessage('');
        setSelectedItem(null);
        showToast('SMS opened. All data cleared.');
      })
      .catch(error => {
        showToast('Failed to send message: ' + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Buyer Information</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputFlex}
          placeholder="Buyer ID"
          value={buyerId}
          onChangeText={setBuyerId}
          keyboardType="numeric"
        />

        <Animatable.View animation="bounceIn" duration={800}>
          <TouchableOpacity
            onPress={handleAddBuyer}
            style={styles.plusButtonSmall}>
            <Text style={styles.plusText}>＋</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>

      {buyerList.length > 0 && (
        <FlatList
          data={buyerList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.buyerRow}>
              <Text style={styles.buyerItem}>
                ID: {item.buyerId} | {item.buyerMobile}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveBuyer(item.buyerId)}
                style={styles.removeButton}>
                <Text style={styles.removeText}>❌</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Text style={styles.messageHeading}>Message</Text>
      <TextInput
        style={styles.messageInput}
        placeholder="Edit your message here"
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={4}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#D5006D" />
      ) : (
        <TouchableOpacity
          onPress={handleSubmitAndSendSMS}
          style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send SMS to All Buyers</Text>
        </TouchableOpacity>
      )}

      {toast ? (
        <Animatable.View animation="slideInUp" style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </Animatable.View>
      ) : null}

      {emojiVisible && (
        <Animatable.Text
          animation="zoomIn"
          iterationCount={1}
          style={styles.emojiBurst}>
          🎉🎊✨
        </Animatable.Text>
      )}
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },

  plusText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  buyerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 6,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 0.5,
  },
  buyerItem: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    paddingHorizontal: 10,
  },
  removeText: {
    fontSize: 18,
    color: 'red',
  },
  messageHeading: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 16,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    height: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#D5006D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toast: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  toastText: {color: '#fff', fontSize: 14},
  emojiBurst: {
    fontSize: 40,
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputFlex: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  plusButtonSmall: {
    backgroundColor: '#D5006D',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default BuyerInformation;
