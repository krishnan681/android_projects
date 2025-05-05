import React, {useState, useContext, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Button,
  Linking,
  Modal,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {RadioButton} from 'react-native-paper';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';
import {BackHandler} from 'react-native';

const AddPeople = ({navigation}) => {
  const {user, userData} = useContext(AuthContext); // Use userData for auth
  const [mybusinessname, setBusinessname] = useState('');
  const [myperson, setPerson] = useState('');
  const [myaddress, setAddress] = useState('');
  const [mycity, setCity] = useState('');
  const [mypincode, setPincode] = useState('');
  const [myproduct, setProduct] = useState('');
  const [mylandLine, setLandLine] = useState('');
  const [myLcode, setLcode] = useState('');
  const [myemail, setEmail] = useState('');
  const [myprefix, setPrefix] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [regName, setRegName] = useState('');
  const [regPrefix, setRegPrefix] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regBusinessPrefix, setRegBusinessPrefix] = useState('');
  const [mymobileno, setMymobileno] = useState('');
  const [cityName, setCityName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const cmpanyPrefix = 'M/s.';
  const mydescription = 'Update Soon';
  const mypriority = '0';
  const mydiscount = '10';
  const [showPopup, setShowPopup] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const resetForm = () => {
    setBusinessname('');
    setAddress('');
    setPerson('');
    setCity('');
    setPincode('');
    setProduct('');
    setLandLine('');
    setLcode('');
    setEmail('');
    setPrefix('');
    setMymobileno('');
    setIsRegistered(false);
  };

  // Help text visibility states
  const [helpText, setHelpText] = useState({
    mobile: false,
    person: false,
    prefix: false,
    business: false,
    address: false,
    city: false,
    pincode: false,
    product: false,
    landline: false,
    std: false,
    email: false,
  });

  // Reset all help texts
  const resetAllHelpTexts = () => {
    setHelpText({
      mobile: false,
      person: false,
      prefix: false,
      business: false,
      address: false,
      city: false,
      pincode: false,
      product: false,
      landline: false,
      std: false,
      email: false,
    });
  };

  // Set specific help text
  const setHelpTextVisible = field => {
    resetAllHelpTexts();
    setHelpText(prev => ({...prev, [field]: true}));
  };

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

  // Check if the mobile number is registered
  const checkMobileNumber = async mobile => {
    try {
      const response = await fetch(
        `https://signpostphonebook.in/client_insert_data_for_new_database.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({mobileno: mobile}),
        },
      );
      const result = await response.json();

      if (result.registered) {
        console.log(result.data);

        // Store values
        setRegBusinessName(result.businessname);
        setRegBusinessPrefix(result.prefix);
        setRegName(result.person);
        setRegPrefix(result.personprefix);
        setIsRegistered(true);

        // Construct Alert message
        let alertMessage = '';
        if (result.businessname) {
          alertMessage = `Mobile Number Already Registered\n\nIn the Name of: ${result.prefix} ${result.businessname}`;
        } else {
          alertMessage = `Mobile Number Already Registered\n\nIn the Name of: ${result.personprefix} ${result.person}`;
        }

        // Show Alert Box
        Alert.alert('Mobile Number Exists', alertMessage, [
          {text: 'OK', onPress: () => setMymobileno('')},
        ]);
      } else {
        setIsRegistered(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to verify mobile number.');
      console.error(error);
    }
  };

  const insertbusinessName = async () => {
    if (!userData) {
      console.log('Error: No authenticated user found.');
      return;
    }

    const dataName = {
      name: userData.businessname || userData.person,
      date: new Date().toISOString().split('T')[0],
      dataentry_name: mybusinessname || myperson,
    };

    try {
      const response = await axios.post(
        'https://signpostphonebook.in/signpostphonebookdataentry_get_names.php',
        dataName,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        console.log('Success', response.data.message);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log('Unable to reach server', error);
    }
  };

  const insertRecord = async e => {
    e.preventDefault();

    if (!mymobileno) {
      Alert.alert('Please enter all required fields.');
      return;
    }

    if (isRegistered) {
      Alert.alert('Mobile number is already registered.');
      return;
    }

    const sendSMS = async () => {
      if (!mymobileno || !/^\d{10,}$/.test(mymobileno)) {
        Alert.alert('Invalid mobile number.');
        return;
      }

      const hasBusiness = !!mybusinessname?.trim();

      const message =
        `Dear ${
          hasBusiness
            ? `${myprefix} ${myperson}, M/s.${mybusinessname}`
            : `${myprefix} ${myperson}`
        },
    Signpost PHONE BOOK is a portal for Mobile Number Finder & Dialer with Digital Marketing. Please kindly view and verify the correctness of details on your firm.
    
    URL :- www.signpostphonebook.in
    User name :- Your mobile number
    Password :- Signpost
    You are registered Under the Category: ${myproduct?.toUpperCase()}` +
        (hasBusiness
          ? `
    You can use the PHONE BOOK for your business promotion in any desired (Pincode) area or Entire Coimbatore.`
          : '');

      const smsBody = encodeURIComponent(message.trim());
      const smsLink = `sms:${mymobileno}?body=${smsBody}`;

      try {
        await Linking.openURL(smsLink);
      } catch (error) {
        console.log('Error:', error);
        Alert.alert('Failed to open SMS app.');
      }
    };

    const Data = {
      businessname: mybusinessname,
      prefix: cmpanyPrefix,
      person: myperson,
      personprefix: myprefix,
      address: myaddress,
      priority: mypriority,
      city: mycity,
      pincode: mypincode,
      mobileno: mymobileno,
      email: myemail,
      product: myproduct,
      landline: mylandLine,
      lcode: myLcode,
      discount: mydiscount,
      description: mydescription,
    };

    try {
      const response = await fetch(
        'https://signpostphonebook.in/client_insert_data_for_new_database.php',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Data),
        },
      );

      const jsonResponse = await response.json();

      if (jsonResponse.Message) {
        Alert.alert('Success', 'Your record has been added successfully!', [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              sendSMS();
            },
          },
        ]);

        await insertCount(userData?.id);
        await insertbusinessName();
      } else {
        Alert.alert('Unexpected response from server.');
      }
    } catch (error) {
      Alert.alert('Error saving data.');
      console.log('Insert error:', error);
    }
  };

  const insertCount = async userid => {
    if (!userid) {
      console.log('Error: No authenticated user ID found.');
      return;
    }

    const dataCount = new URLSearchParams({
      userid: userData.id,
      name: userData.businessname || userData.person,
      date: new Date().toISOString().split('T')[0],
      count: '1', // Ensure count is a string
    });

    try {
      const response = await fetch(
        'https://signpostphonebook.in/get_count_from_signpostphonebookdata.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: dataCount.toString(),
        },
      );

      const responseData = await response.json();

      if (responseData.success) {
        console.log(
          `Success: ${responseData.message}, New Count: ${responseData.newCount}`,
        );
      } else {
        console.log(`Error: ${responseData.message}`);
      }
    } catch (error) {
      console.log(`Error: Unable to reach the server. ${error.message}`);
    }
  };

  //for business name input box

  const handleBusinessName = text => {
    // Remove any character that is not a letter or space
    const filteredText = text.replace(/[^a-zA-Z\s]/g, '');
    setBusinessname(filteredText);
  };

  //for person name input box

  const handlePersonName = text => {
    // Remove any character that is not a letter or space
    const filteredText = text.replace(/[^a-zA-Z\s]/g, '');
    setPerson(filteredText);
  };

  //for city name input box

  const handleCityName = text => {
    // Remove any character that is not a letter or space
    const filteredText = text.replace(/[^a-zA-Z\s]/g, '');
    setCity(filteredText);
  };

  // for Pincode number

  const handlePincode = text => {
    const numericText = text.replace(/[^0-9]/g, ''); // Allow only numbers
    setPincode(numericText);
  };

  // for Landline number

  const handleLandline = text => {
    const numericText = text.replace(/[^0-9]/g, ''); // Allow only numbers
    setLandLine(numericText);
  };

  // for Std number

  const handleStdCode = text => {
    const numericText = text.replace(/[^0-9]/g, ''); // Allow only numbers
    setLcode(numericText);
  };

  // for mobile number

  const handleEndEditing = () => {
    // Regular expression to match a 10-digit number starting with 6, 7, 8, or 9
    const mobileNumberPattern = /^[6-9]\d{9}$/;

    if (!mobileNumberPattern.test(mymobileno)) {
      Alert.alert('Invalid Mobile Number', 'Mobile number must be 10 digits.');
      setMymobileno(''); // Clear the input field
    } else {
      // Proceed with further actions, such as checking if the number is registered
      checkMobileNumber(mymobileno);
    }
  };

  const handleChange = text => {
    // Remove any non-numeric characters
    const cleaned = text.replace(/[^0-9]/g, '');
    // Update state with cleaned text
    setMymobileno(cleaned);
    // Optionally, provide feedback if length exceeds 10
    if (cleaned.length > 10) {
      Alert.alert('Invalid Length', 'Mobile number cannot exceed 10 digits.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <ScrollView>
          {/* Mobile Number */}
          <Text style={styles.label}>*Mobile Number :</Text>
          <TextInput
            placeholder="Mobile Number"
            keyboardType="number-pad"
            maxLength={10}
            style={styles.input}
            value={mymobileno}
            onChangeText={handleChange}
            onEndEditing={handleEndEditing}
            onFocus={() => setHelpTextVisible('mobile')}
          />
          {helpText.mobile && (
            <Text style={styles.helpText}>
              Type 10 digits without Country code (+91), without gap Don't Type
              Land Line
            </Text>
          )}

          {/* Person */}
          <Text style={styles.label}>*Person :</Text>
          <TextInput
            placeholder="Person"
            style={styles.input}
            value={myperson}
            onChangeText={handlePersonName}
            onFocus={() => setHelpTextVisible('person')}
          />
          {helpText.person && (
            <Text style={styles.helpText}>Type Initial at the end</Text>
          )}
          {/* Prefix */}
          <View style={styles.prefixcontainer}>
            <Text style={styles.label}>*Prefix:</Text>
            <RadioButton.Group
              onValueChange={value => {
                setPrefix(value);
                setHelpTextVisible('prefix');
              }}
              value={myprefix}>
              <View style={styles.radioContainer}>
                <View style={styles.radioOption}>
                  <RadioButton value="Mr." />
                  <Text>Mr.</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="Ms." />
                  <Text>Ms.</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>
          {helpText.prefix && (
            <Text style={styles.helpText}>
              Select Mr. For Gents and Ms. for Ladies
            </Text>
          )}

          {/* Business Name */}
          <Text style={styles.label}>*Firm / Business Name :</Text>
          <TextInput
            placeholder="Name/Business Name"
            style={styles.input}
            value={mybusinessname}
            onChangeText={handleBusinessName}
            onFocus={() => setHelpTextVisible('business')}
          />

          {helpText.business && (
            <Text style={styles.helpText}>
              Type Your FirmName or BusinessName
            </Text>
          )}

          {/* City */}
          <Text style={styles.label}>*City :</Text>
          <TextInput
            placeholder="City"
            style={styles.input}
            value={mycity}
            onChangeText={handleCityName}
            onFocus={() => setHelpTextVisible('cityName')}
          />

          {helpText.cityName && (
            <Text style={styles.helpText}>
              Type City Name. Don't Use Petnames (Kovai Etc.)
            </Text>
          )}

          {/* Pincode */}
          <Text style={styles.label}>*Pincode :</Text>
          <TextInput
            placeholder="Pincode"
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
            value={mypincode}
            onChangeText={handlePincode}
            onFocus={() => setHelpTextVisible('pincode')}
          />
          {helpText.pincode && (
            <Text style={styles.helpText}>
              Type 6 Digits Continuously Without Gap
            </Text>
          )}

          {/* Address */}
          <Text style={styles.label}>*Address :</Text>
          <TextInput
            placeholder="Address"
            style={[styles.input, {height: 80}]}
            multiline
            value={myaddress}
            onChangeText={text => setAddress(text)}
            onFocus={() => setHelpTextVisible('address')}
          />

          {helpText.address && (
            <Text style={styles.helpText}>
              Type Door Number, Street, Flat No, Appartment Name, Landmark, Area
              Name etc.
            </Text>
          )}

          {/* Product / Service */}
          <Text style={styles.label}>*Product / Service :</Text>
          <TextInput
            placeholder="Product"
            style={styles.input}
            value={myproduct}
            onChangeText={text => setProduct(text)}
            onFocus={() => setHelpTextVisible('product')}
          />

          {helpText.product && (
            <Text style={styles.helpText}>
              Type Correct & Specific Name of Product/Service offered. Sepparate
              Each Keyword By Comma. For
            </Text>
          )}

          {/* Landline */}
          <Text style={styles.label}>Landline Number :</Text>
          <TextInput
            placeholder="Landline Number"
            keyboardType="number-pad"
            style={styles.input}
            value={mylandLine}
            onChangeText={handleLandline}
            onFocus={() => setHelpTextVisible('landline')}
          />

          {helpText.landline && (
            <Text style={styles.helpText}>
              Type Only Landline, if Available. Don't Type Mobile Number here.
            </Text>
          )}

          {/* STD Code */}
          <Text style={styles.label}>STD Code :</Text>
          <TextInput
            placeholder="STD Code"
            keyboardType="number-pad"
            style={styles.input}
            value={myLcode}
            onChangeText={handleStdCode}
            onFocus={() => setHelpTextVisible('std')}
          />

          {helpText.std && (
            <Text style={styles.helpText}>
              Type Only Landline, if Available. Don't Type Mobile Number here.
            </Text>
          )}

          {/* Email */}
          <Text style={styles.label}>Email :</Text>
          <TextInput
            style={styles.input}
            placeholder="example@mail.com"
            keyboardType="email-address"
            value={myemail}
            onChangeText={text => setEmail(text)}
            autoCapitalize="none"
            onFocus={() => setHelpTextVisible('email')}
          />

          {helpText.email && (
            <Text style={styles.helpText}>
              Type Correctly, Only If Available
            </Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={insertRecord}>
            <Text style={styles.buttonText}>Submit</Text>
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
        </ScrollView>
      </View>
    </View>
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
  //------------
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  inputAndroid: {
    borderWidth: 3,
    borderColor: '#000000',
  },
  header: {
    padding: 20,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 50,
    fontWeight: '500',
    color: '#aa336a',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 300,
    padding: 20,
  },
  prefixcontainer: {
    padding: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '700',
  },
  input: {
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 5,
    marginVertical: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  button: {
    backgroundColor: '#D5006D',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpText: {
    color: 'red',
    fontSize: 16,
  },
});

export default AddPeople;
