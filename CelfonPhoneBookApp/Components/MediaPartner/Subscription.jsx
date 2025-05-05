import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  Modal,
  BackHandler,
} from 'react-native';

import { AuthContext } from '../AuthContext';

const Subscription = () => {
  const [selectedPrice, setSelectedPrice] = useState(null);
  const { userData, setUserData } = useContext(AuthContext);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleBuyNow = price => {
    setSelectedPrice(price);
  };

  const validateInputs = () => {
    const { businessname, address, city, pincode } = userData;

    if (!businessname.trim() || !address.trim() || !city.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return false;
    }

    if (!/^\d{6}$/.test(pincode)) {
      Alert.alert('Validation Error', 'Pincode must be a 6-digit number.');
      return false;
    }

    return true;
  };

  const handleUPIPayment = async amount => {
    if (!validateInputs()) return;

    const payeeVPA = 'naveenbsc.mca1518-1@okicici';
    const payeeName = 'Signpost';
    const transactionNote = 'Subscription Payment';

    const upiUrl = `upi://pay?pa=${encodeURIComponent(payeeVPA)}&pn=${encodeURIComponent(
      payeeName,
    )}&tn=${encodeURIComponent(transactionNote)}&am=${encodeURIComponent(
      amount,
    )}&cu=INR`;

    try {
      const supported = await Linking.canOpenURL(upiUrl);
      if (supported) {
        Linking.openURL(upiUrl);
      } else {
        Alert.alert('Error', 'No UPI app found to handle the payment.');
      }
    } catch (err) {
      console.error('Linking error:', err);
      Alert.alert('Error', 'Something went wrong while opening UPI app.');
    }
  };

  const handleCancelAndReset = () => {
    setSelectedPrice(null);
    setUserData({
      businessname: '',
      address: '',
      city: '',
      pincode: '',
    });
    setShowCancelModal(false);
  };

  useEffect(() => {
    const backAction = () => {
      if (selectedPrice !== null) {
        setShowCancelModal(true);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [selectedPrice]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
      {selectedPrice === null ? (
        <View>
          <Text style={styles.title}>Choose Your Plan</Text>

          {[{ title: '1 Week Trial Pack', price: 20, features: ['• Duration: 7 Days', '• Bulk Messages for 7 days', '• Free Support'] },
          { title: '1 Month Pack', price: 200, features: ['• Referral Bonus: ₹50', '• Free Support', '• Sign-up Bonus: ₹20'] },
          { title: '1 Year Pack', price: 1000, features: ['• Unlimited messages', '• 24/7 Support', '• Sign-up Bonus: ₹20'] },
          ].map((plan, idx) => (
            <View style={styles.planCard} key={idx}>
              <Text style={styles.planHeader}>{plan.title}</Text>
              <Text style={styles.planPrice}>₹{plan.price}</Text>
              <View style={styles.features}>
                {plan.features.map((feature, i) => (
                  <Text key={i}>{feature}</Text>
                ))}
              </View>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleBuyNow(plan.price)}>
                <Text style={{color:"white", fontWeight:"bold"}}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Confirm Order & Pay</Text>
          <Text style={styles.subtitle}>
            Please make the payment, after that you can enjoy all the features.
          </Text>

          <Text style={styles.sectionTitle}>From Payment Details</Text>
          <TextInput
            placeholder="Business Name"
            style={styles.input}
            value={userData.businessname}
            onChangeText={text => setUserData({ ...userData, businessname: text })}
          />
          <TextInput
            placeholder="Address"
            style={styles.input}
            value={userData.address}
            onChangeText={text => setUserData({ ...userData, address: text })}
          />
          <TextInput
            placeholder="City"
            style={styles.input}
            value={userData.city}
            onChangeText={text => setUserData({ ...userData, city: text })}
          />
          <TextInput
            placeholder="Pincode"
            style={styles.input}
            keyboardType="numeric"
            value={userData.pincode}
            onChangeText={text => setUserData({ ...userData, pincode: text })}
          />

          <Text style={styles.sectionTitle}>To Billing Address</Text>
          <Text style={styles.readOnlyField}>Company: signpostphonebook</Text>
          <Text style={styles.readOnlyField}>Address: Address</Text>
          <Text style={styles.readOnlyField}>City: Coimbatore</Text>
          <Text style={styles.readOnlyField}>Pincode: 621450</Text>

          <View style={styles.paymentSummary}>
            <Text style={styles.payLabel}>You have to pay:</Text>
            <Text style={styles.amount}>₹{selectedPrice}.00</Text>
            <Text>Enjoy all features and perks after you complete payment.</Text>
            <Text style={styles.highlight}>
              100% Guaranteed support and updates for the next 5 years.
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.buyButton, { backgroundColor: '#ccc' }]}
              onPress={() => setShowCancelModal(true)}>
              <Text style={styles.buyButtonText}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => handleUPIPayment(selectedPrice)}>
              <Text style={{color:"white", fontWeight:"bold"}}>Pay ₹{selectedPrice}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cancel Confirmation</Text>
            <Text style={styles.modalMessage}>Do you want to cancel and go back?</Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setShowCancelModal(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ef4444' }]}
                onPress={handleCancelAndReset}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  planCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  planHeader: { fontSize: 18, fontWeight: 'bold' },
  planPrice: { fontSize: 20, color: '#10b981', marginVertical: 8 },
  features: { marginBottom: 12 },
  buyButton: {
    backgroundColor: '#10b981',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  // buyButtonText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  readOnlyField: { backgroundColor: '#f0f0f0', padding: 10, marginBottom: 6 },
  paymentSummary: {
    backgroundColor: '#2563eb',
    padding: 20,
    borderRadius: 16,
    marginTop: 32,
    marginBottom: 28,
    elevation: 5,
  },
  payLabel: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
  },
  amount: {
    fontSize: 36,
    color: '#facc15',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  highlight: {
    marginTop: 12,
    color: '#ffffff',
    fontStyle: 'italic',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 40,
    gap: 12,
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
  },

  buyButtonText: {
    // color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalMessage: { fontSize: 14, marginBottom: 20 },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 6,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Subscription;
