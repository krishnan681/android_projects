import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from './AuthContext';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import {PermissionsAndroid, Platform} from 'react-native';
import * as Animatable from 'react-native-animatable';

const Profile = () => {
  const {userData, setUserData} = useContext(AuthContext);
  const [isOwner, setIsOwner] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [taskCount, setTaskCount] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [membershipModalVisible, setMembershipModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const date = new Date().toISOString().split('T')[0];
  const defaultImage = 'https://signpostphonebook.in/default_profile.png';

  const [buyerId, setBuyerId] = useState('');
  const [soldBuyerId, setSoldBuyerId] = useState(null); // Prevent duplicate ID use

  const [isVerified, setIsVerified] = useState(false);
  const [hasTriedVerification, setHasTriedVerification] = useState(false);
  const [isSaleSuccessful, setIsSaleSuccessful] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [soldMessageVisible, setSoldMessageVisible] = useState(false);
  const [isDuplicateEntry, setIsDuplicateEntry] = useState(false);

  const openMembershipModal = () => {
    setMembershipModalVisible(true);
    checkIsOwner();
  };
  const closeMembershipModal = () => setMembershipModalVisible(false);

  const checkIsOwner = async () => {
    try {
      const response = await fetch(
        `https://signpostphonebook.in/icecream/check_shop_owner_id.php`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({user_id: userData.id}),
        },
      );
      const result = await response.json();
      if (result.success) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
        checkIsBuyer();
      }
    } catch (error) {
      console.log('Owner Check Error:', error);
    }
  };

  const checkIsBuyer = async () => {
    try {
      const response = await fetch(
        `https://signpostphonebook.in/icecream/check_ice_cream_buyer.php`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({user_id: userData.id}),
        },
      );
      const result = await response.json();
      if (result.success) {
        setIsBuyer(true);
      } else {
        setIsBuyer(false);
      }
    } catch (error) {
      console.log('Buyer Check Error:', error);
    }
  };

  const fetchProfileImage = async () => {
    try {
      const response = await axios.get(
        `https://signpostphonebook.in/image_upload_for_new_database.php?id=${userData.id}`,
      );
      if (response.data.success) {
        const imageUrl = response.data.imageUrl.startsWith('http')
          ? response.data.imageUrl
          : `https://signpostphonebook.in/${response.data.imageUrl}`;
        setProfileImage(imageUrl + `?t=${new Date().getTime()}`);
      }
    } catch (error) {
      console.log('Profile Image Fetch Error:', error);
    }
  };

  const changeProfileImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      console.log('Permission denied');
      return;
    }

    const options = {
      mediaType: 'photo',
      selectionLimit: 1, // only 1 image
      includeBase64: false, // no base64 needed
    };

    try {
      const response = await launchImageLibrary(options);

      console.log('Image Picker Response:', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        console.log('Selected Image:', selectedImage);
        // Do whatever you want with selectedImage.uri
      }
    } catch (error) {
      console.error('Error launching image library:', error);
    }
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  };

  const fetchUserData = async (userid, date, signal) => {
    try {
      const response = await fetch(
        `https://signpostphonebook.in/data_entry_details.php?userid=${userid}&date=${date}`,
        {signal},
      );
      const data = await response.json();
      if (data.status === 'success') {
        return data.data;
      } else if (data.message === 'No record found.') {
        return {count: 0};
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log('User Data Fetch Error:', error.message);
      }
      return null;
    }
  };

  const fetchReferralCount = async () => {
    try {
      const response = await fetch(
        `https://signpostphonebook.in/try_referrals_count.php?mobile=${encodeURIComponent(
          userData.mobileno,
        )}`,
      );
      const data = await response.text();
      const match = data.match(/Total Referred: (\d+)/);
      if (match) {
        setReferralCount(parseInt(match[1], 10));
      }
    } catch (error) {
      console.log('Referral Count Fetch Error:', error);
    }
  };

  useEffect(() => {
    if (!userData?.id) return;
    fetchProfileImage();
  }, [userData]);

  useEffect(() => {
    if (!userData?.id || !date) return;
    const controller = new AbortController();
    const signal = controller.signal;

    const getData = async () => {
      setIsLoading(true);
      const data = await fetchUserData(userData.id, date, signal);
      setIsLoading(false);
      if (data) {
        setTaskCount(data.count || 0);
        fetchReferralCount();
      } else {
        setTaskCount(0);
      }
    };
    getData();
    return () => controller.abort();
  }, [userData, date]);

  if (!userData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF69B4" />
      </View>
    );
  }

  const handleVerifyClick = () => {
    if (!buyerId.trim()) {
      alert('Please enter the Customer ID.');
      return;
    }

    setHasTriedVerification(true); // <-- Mark that the verification was attempted
    console.log('Verifying Customer ID:', buyerId); // Debugging line
    verifyIsvalidCustomer();
  };

  const verifyIsvalidCustomer = async () => {
    setIsVerifying(true);
    setIsVerified(false); // Reset before trying

    try {
      const response = await fetch(
        'https://signpostphonebook.in/icecream/validate_buyer.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({buyer_id: buyerId}),
        },
      );

      const result = await response.json();
      console.log('API Response:', result);

      if (result.success) {
        console.log('Valid Customer');
        setIsVerified(true); // ✅
      } else {
        console.log('Invalid Customer');
        setIsVerified(false); // ❌
      }
    } catch (error) {
      console.log('Verification error:', error);
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  
  const iceCreamTransaction = async () => {
    try {
      const response = await fetch(
        `https://signpostphonebook.in/icecream/transaction_details.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerid: buyerId,
            userid: userData.id,
            username: userData.businessname || userData.person,
          }),
        }
      );
  
      const result = await response.json();
  
      if (result.status === "error" && result.message === "Duplicate entry: Transaction already exists for this customer.") {
        // Handle duplicate entry
        setIsDuplicateEntry(true); // Show duplicate entry message
        setTimeout(() => {
          setIsDuplicateEntry(false); // Hide after 3 seconds
        }, 3000);
  
        // Reset the states after handling duplicate
        setBuyerId('');
        setIsVerified(false);
        setHasTriedVerification(false);
  
      } else if (result.status === "success") {
        console.log('Ice cream sold successfully');
        setIsSaleSuccessful(true);
        setSoldBuyerId(buyerId);
        setBuyerId(''); // Reset the buyer ID input field
        setIsVerified(false);
        setHasTriedVerification(false);
  
        setTimeout(() => {
          setIsSaleSuccessful(false); // Reset after 3 seconds
        }, 3000);
  
      } else {
        console.log('Transaction failed:', result.message);
      }
  
      // Reset buyerId and other states after the transaction attempt
      setBuyerId('');
      setIsVerified(false);
      setHasTriedVerification(false);
  
    } catch (error) {
      console.log('Transaction error:', error);
      
      // Reset states in case of an error
      setBuyerId('');
      setIsVerified(false);
      setHasTriedVerification(false);
    }
  };
  

  const handleSoldSubmit = () => {
    if (!isVerified) return;
    iceCreamTransaction();
  };

  useEffect(() => {
    if (hasTriedVerification) {
      const timer = setTimeout(() => {
        setHasTriedVerification(false);
      }, 3000); // hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [hasTriedVerification]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FF69B4', '#FFB6C1']} style={styles.header}>
        {/* Profile Image with Touchable */}
        <View style={styles.profileImageWrapper}>
          <Image
            source={{uri: profileImage || defaultImage}}
            style={styles.profileImage}
            resizeMode="cover"
          />

          {/* Separate TouchableOpacity JUST for camera icon */}
          <TouchableOpacity
            onPress={changeProfileImage}
            style={styles.cameraIconWrapper}>
            <Icon name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* User Name */}
        <Text style={styles.name}>
          {userData?.businessname || userData?.person || 'Your Name'}
        </Text>
        {/* <Text style={styles.name}>
          {userData?.id || 'Your Name'}
        </Text> */}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{taskCount}</Text>
            <Text style={styles.statLabel}>Total Entries</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{referralCount}</Text>
            <Text style={styles.statLabel}>Referrals</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Body */}
      <ScrollView style={styles.body}>
        <View style={styles.infoBox}>
          <Icon name="user" size={20} color="#FF69B4" />
          <Text style={styles.infoText}>
            {userData.description || 'Description'}
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Icon name="cubes" size={20} color="#FF69B4" />
          <Text style={styles.infoText}>{userData.product || 'Product'}</Text>
        </View>
        <View style={styles.infoBox}>
          <Icon name="map-marker" size={20} color="#FF69B4" />
          <Text style={styles.infoText}>
            {userData.address || 'Address'}, {userData.city || 'City'},{' '}
            {userData.pincode || 'Pincode'}
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Icon name="phone" size={20} color="#FF69B4" />
          <Text style={styles.infoText}>
            {userData.mobileno || 'Mobile No'}
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Icon name="envelope" size={20} color="#FF69B4" />
          <Text style={styles.infoText}>{userData.email || 'Email'}</Text>
        </View>
      </ScrollView>

      {/* Button */}
      <TouchableOpacity
        style={styles.membershipButton}
        onPress={openMembershipModal}>
        <Text style={styles.buttonText}>View Membership Card</Text>
      </TouchableOpacity>

      {/* Modal */}

      <Modal visible={membershipModalVisible} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {/* HEADER */}
            <View style={styles.modalheader}>
              <Image
                source={require('../src/assets/images/Logo_Phonebook.jpg')}
                style={styles.logo}
              />
              <Text style={styles.modalheaderText}>Membership Card</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeMembershipModal}>
                <Text>X</Text>
              </TouchableOpacity>
            </View>

            {/* CARD CONTENT */}
            <View style={styles.cardContent}>
              <Image
                source={{uri: profileImage || defaultImage}}
                style={styles.memprofileImage}
              />

              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  Name: {userData?.businessname || userData?.person}
                </Text>

                {isBuyer && !isOwner && (
                  <View style={styles.buyerIdBadge}>
                    <Text style={styles.buyerIdText}>ID: {userData?.id}</Text>
                  </View>
                )}

                <Text style={styles.addressText}>
                  Address: {userData?.address || 'N/A'},{' '}
                  {userData?.city || 'N/A'}
                </Text>

                <Text style={styles.addressText}>
                  Pincode: {userData?.pincode || 'N/A'}
                </Text>
              </View>

              {isOwner && (
                <View style={styles.ownerBadge}>
                  <Image
                    source={require('../src/assets/images/ice_cream_cone.png')}
                    style={{width: 100, height: 100, marginTop: 5}}
                  />
                </View>
              )}
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                This card is valid for 12 Months from the date of issue.
              </Text>
              <Text style={styles.footerAddress}>
                46, Sidco Industrial Estate, Coimbatore - 641021
              </Text>
            </View>

            {/* Input & Buttons */}
            {isOwner && (
              <View style={styles.sellingBoxVertical}>
                <TextInput
                  placeholder="Enter Customer ID"
                  value={buyerId}
                  onChangeText={text => {
                    setBuyerId(text);
                    setIsVerified(false); // Reset verification status
                    setHasTriedVerification(false); // Reset tried status to clear animation
                    setIsSaleSuccessful(false); // Reset sale success
                    setIsDuplicateEntry(false); // Reset duplicate entry state
                  }}
                  style={styles.inputFull}
                  editable={true}
                />

                {hasTriedVerification && (
                  <Animatable.View
                    animation={isVerified ? 'bounceIn' : 'shake'}
                    duration={800}
                    style={{
                      marginVertical: 10,
                      padding: 10,
                      borderRadius: 8,
                      backgroundColor: isVerified ? '#D4EDDA' : '#F8D7DA',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: isVerified ? '#155724' : '#721C24',
                        fontWeight: 'bold',
                      }}>
                      {isVerified
                        ? '✅ ID is Verified'
                        : '❌ ID is Not Verified'}
                    </Text>
                  </Animatable.View>
                )}

                {isDuplicateEntry && (
                  <Animatable.View
                    animation="shake"
                    duration={800}
                    style={styles.duplicateEntryContainer}>
                    <Text style={styles.duplicateEntryText}>
                      ❌ Duplicate Entry! This ID has already been used.
                    </Text>
                  </Animatable.View>
                )}

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={handleVerifyClick}
                    disabled={isVerifying || isVerified || isSaleSuccessful}
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: isSaleSuccessful
                          ? '#ccc'
                          : isVerified
                          ? '#4CAF50'
                          : '#FF69B4',
                      },
                    ]}>
                    <Text style={styles.buttonText}>
                      {isVerifying
                        ? 'Verifying...'
                        : isVerified
                        ? 'Verified'
                        : 'Verify'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSoldSubmit}
                    disabled={!isVerified || isSaleSuccessful}
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor:
                          !isVerified || isSaleSuccessful ? '#ccc' : '#FF69B4',
                      },
                    ]}>
                    <Text style={styles.buttonText}>
                      {isSaleSuccessful ? 'Sold' : 'Sell'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Ice Cream Sold Message */}
            {isSaleSuccessful && (
              <Animatable.View
                animation="fadeInUp"
                duration={800}
                style={styles.soldMessageContainer}>
                <Text style={styles.soldMessageText}>1 Ice Cream Sold</Text>
              </Animatable.View>
            )}
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
  header: {
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
  },

  profileImageWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },

  cameraIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#FF69B4',
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },

  name: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    flexWrap: 'wrap',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },

  statBox: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  statLabel: {
    fontSize: 12,
    color: '#fff',
  },

  body: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  membershipButton: {
    backgroundColor: '#FF69B4',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  //

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  modalheader: {
    backgroundColor: '#ff4581',
    width: '100%',
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center', // Align items vertically
    justifyContent: 'center', // Align items horizontally
    padding: 10,
  },

  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  modalheaderText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    bottom: 25,

    marginLeft: 10,
    marginBottom: -50,
  },
  membershipText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  cardContent: {
    marginRight: -105,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative', // <-- ADD THIS
  },

  memprofileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  validText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray',
    marginTop: 5,
  },
  addressText: {
    width: '70%',
    fontSize: 14,
    marginTop: 5,
    flexWrap: 'wrap',
  },
  footer: {
    backgroundColor: '#ff4081',
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: 'white',
  },
  footerAddress: {
    fontSize: 12,
    color: 'white',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: 'white',
    width: 25,
    height: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  //

  ownerBadge: {
    position: 'absolute',
    right: 100,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ownerIcon: {
    width: 60,
    height: 60,
  },

  ownerText: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
  },

  buyerIdBadge: {
    marginTop: 4,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buyerIdText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },

  ///
  sellingBoxVertical: {
    paddingHorizontal: 10,
    marginTop: 10,
  },

  inputFull: {
    height: 42,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 8,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },

  actionButton: {
    flex: 0.48,
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  soldMessageContainer: {
    backgroundColor: '#D4EDDA', // Green background for success
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  soldMessageText: {
    color: '#155724', // Dark green text color
    fontWeight: 'bold',
    fontSize: 18,
  },

  duplicateEntryContainer: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F8D7DA',
  },
  duplicateEntryText: {
    textAlign: 'center',
    color: '#721C24',
    fontWeight: 'bold',
  },
});

export default Profile;
