import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Signup = ({navigation}) => {
  // State variables
  const [isBusinessMode, setIsBusinessMode] = useState(true);

  const [mypromoCode, setPromoCode] = useState('');
  const [mybusinessname, setBusinessname] = useState('');
  const [mydoorno, setDoorno] = useState('');
  const [myperson, setPerson] = useState('');
  const [mycity, setMycity] = useState('');
  const [mypincode, setPincode] = useState('');
  const [myproduct, setProduct] = useState('');
  const [mylandLine, setLandLine] = useState('');
  const [myLcode, setLcode] = useState('');
  const [myemail, setEmail] = useState('');
  const [mymobileno, setMobileno] = useState('');
  const [myprefix, setPrefix] = useState('M/s.'); // Default to M/S for business

  const [isRegistered, setIsRegistered] = useState(false);

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
    promocode: false,
  });

  const [dateTime, setDateTime] = useState('');

  // Toggle business / personal mode
  const toggleMode = mode => {
    if (
      (mode === 'business' && !isBusinessMode) ||
      (mode === 'personal' && isBusinessMode)
    ) {
      setIsBusinessMode(!isBusinessMode);
      resetForm();
      // Set default prefix only for business mode
      if (mode === 'business') {
        setPrefix('M/s.');
      } else {
        setPrefix(''); // No default prefix in personal mode
      }
    }
  };

  // Reset all form fields and flags
  const resetForm = () => {
    setBusinessname('');
    setPerson('');
    // Reset prefix depending on mode
    setPrefix(isBusinessMode ? 'M/S' : 'Mr.');
    setMobileno('');
    setDoorno('');
    setMycity('');
    setPincode('');
    setProduct('');
    setLandLine('');
    setLcode('');
    setEmail('');
    setPromoCode('');
    setIsRegistered(false);
    resetAllHelpTexts();
  };

  // Input validation handlers
  const handleBusinessName = text => {
    // Accept all except numbers
    const filteredText = text;
    setBusinessname(filteredText);
  };
  const handlePersonName = text => {
    if (/^[a-zA-Z\s]*$/.test(text)) setPerson(text);
  };
  const handlePincode = text => setPincode(text.replace(/[^0-9]/g, ''));
  const handleLandline = text => setLandLine(text.replace(/[^0-9]/g, ''));
  const handleStdCode = text => setLcode(text.replace(/[^0-9]/g, ''));
  const handleCity = () => {
      if (`${isBusinessMode? mybusinessname : myperson}`) {
        setHelpTextVisible('cityName');
      } else {
        Alert.alert(`${isBusinessMode ? 'Enter Business Name':'Enter Person Name'}`);
        resetForm();
      }
    };

  // Help text controls
  const resetAllHelpTexts = () =>
    setHelpText(
      Object.keys(helpText).reduce((acc, key) => ({...acc, [key]: false}), {}),
    );

  const setHelpTextVisible = field => {
    resetAllHelpTexts();
    setHelpText(prev => ({...prev, [field]: true}));
  };

  // Check mobile uniqueness on server
  const checkMobileNumber = async mobile => {
    // immediately reject first digit 1–5
    if (mobile.length === 1 && !['6', '7', '8', '9'].includes(mobile[0])) {
      Alert.alert(
        'Invalid Start',
        'Mobile number must start with 6, 7, 8, or 9.',
      );
      setMobileno('');
      return;
    }
    if (mobile.length !== 10) return;

    try {
      const response = await fetch(
        'https://signpostphonebook.in/client_insert_data_for_new_database.php',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({mobileno: mobile}),
        },
      );
      const result = await response.json();
      if (result.registered) {
        setIsRegistered(true);
        Alert.alert(
          'Mobile Number Exists',
          `Already registered under: ${
            result.businessname || result.person || 'Unknown'
          }`,
        );
        setMobileno('');
      } else {
        setIsRegistered(false);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to verify mobile number.');
    }
  };

  const insertRecord = async () => {
    if (isRegistered) {
      return Alert.alert('Error', 'Mobile number already registered.');
    }

    // ✅ Business Mode
    if (isBusinessMode) {
      if (
        !mybusinessname.trim() ||
        !mydoorno.trim() ||
        !mycity.trim() ||
        !mypincode.trim() ||
        !mymobileno.trim() ||
        !myproduct.trim()
      ) {
        return Alert.alert(
          'Validation Error',
          'Please fill all required business fields.',
        );
      }

      if (mypincode.length !== 6) {
        return Alert.alert('Validation Error', 'Pincode must be 6 digits.');
      }

      if (mymobileno.length !== 10) {
        return Alert.alert(
          'Validation Error',
          'Mobile number must be 10 digits.',
        );
      }

      const businessData = {
        businessname: mybusinessname,
        address: mydoorno,
        city: mycity,
        pincode: mypincode,
        prefix: 'M/s.',
        mobileno: mymobileno,
        email: myemail, // optional, but included if available
        product: myproduct,
        landline: mylandLine,
        lcode: myLcode,
        promocode: mypromoCode,
        person: '',
        personprefix: '',
      };

      try {
        const res = await fetch(
          'https://signpostphonebook.in/client_insert_data_for_new_database.php',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(businessData),
          },
        );

        const json = await res.json();

        if (json.Message) {
          Alert.alert('Success', json.Message);
          resetForm();
          navigation.navigate('Login');
        } else {
          Alert.alert('Error', 'Unexpected server response.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', error.message);
      }

      // ✅ Personal Mode
    } else {
      if (
        !myperson.trim() ||
        !myprefix.trim() ||
        !mydoorno.trim() ||
        !mycity.trim() ||
        !mypincode.trim() ||
        !mymobileno.trim()
      ) {
        return Alert.alert(
          'Validation Error',
          'Please fill all required personal fields.',
        );
      }

      if (myprefix !== 'Mr.' && myprefix !== 'Ms.') {
        return Alert.alert(
          'Validation Error',
          'Please select prefix Mr. or Ms.',
        );
      }

      if (mypincode.length !== 6) {
        return Alert.alert('Validation Error', 'Pincode must be 6 digits.');
      }

      if (mymobileno.length !== 10) {
        return Alert.alert(
          'Validation Error',
          'Mobile number must be 10 digits.',
        );
      }

      const personalData = {
        person: myperson,
        address: mydoorno,
        city: mycity,
        pincode: mypincode,
        prefix: '',
        personprefix: myprefix,
        mobileno: mymobileno,
        email: myemail, // optional, included if available
        product: '', // not applicable in personal mode
        landline: mylandLine,
        lcode: myLcode,
        promocode: mypromoCode,
        businessname: '',
      };

      try {
        const res = await fetch(
          'https://signpostphonebook.in/client_insert_data_for_new_database.php',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(personalData),
          },
        );

        const json = await res.json();

        if (json.Message) {
          Alert.alert('Success', json.Message);
          resetForm();
          navigation.navigate('Login');
        } else {
          Alert.alert('Error', 'Unexpected server response.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}>
      <LinearGradient colors={['#4f9fff', '#b6d6ff']} style={styles.header}>
        <Image
          source={require('../src/assets/images/comaany-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.dateTime}>{dateTime}</Text>
      </LinearGradient>

      <View style={styles.container}>
        {/* Mode Toggle */}
        <View style={styles.toggleWrapper}>
          <TouchableOpacity
            onPress={() => toggleMode('business')}
            style={[
              styles.toggleButton,
              isBusinessMode ? styles.activeToggle : styles.inactiveToggle,
            ]}>
            <Text
              style={[
                styles.toggleText,
                isBusinessMode
                  ? styles.activeToggleText
                  : styles.inactiveToggleText,
              ]}>
              Business
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleMode('personal')}
            style={[
              styles.toggleButton,
              !isBusinessMode ? styles.activeToggle : styles.inactiveToggle,
            ]}>
            <Text
              style={[
                styles.toggleText,
                !isBusinessMode
                  ? styles.activeToggleText
                  : styles.inactiveToggleText,
              ]}>
              Person
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 40}}>
          {/* Mobile Number - Common First */}
          <Input
            label="Mobile Number *"
            value={mymobileno}
            onChangeText={text => {
              setMobileno(text);
              checkMobileNumber(text);
            }}
            placeholder="Enter 10-digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            onFocus={() => setHelpTextVisible('mobile')}
          />
          {helpText.mobile && (
            <Text style={styles.helpText}>Enter your WhatsApp number</Text>
          )}

          {isBusinessMode ? (
            <>
              {/* Business Name */}
              <Input
                label="Business Name *"
                value={mybusinessname}
                onChangeText={handleBusinessName}
                placeholder="Enter business name"
                onFocus={() => setHelpTextVisible('business')}
              />

              {/* City */}
              <Input
                label="City *"
                value={mycity}
                onChangeText={handleCity}
                placeholder="Enter city"
                onFocus={() => setHelpTextVisible('city')}
              />
              {helpText.city && (
                <Text style={styles.helpText}>Type full city name</Text>
              )}

              {/* Pincode */}
              <Input
                label="Pincode *"
                value={mypincode}
                onChangeText={handlePincode}
                placeholder="Enter 6-digit pincode"
                keyboardType="number-pad"
                maxLength={6}
                onFocus={() => setHelpTextVisible('pincode')}
              />
              {helpText.pincode && (
                <Text style={styles.helpText}>Use valid Indian pincode</Text>
              )}

              {/* Address */}
              <Input
                label="Address *"
                value={mydoorno}
                onChangeText={setDoorno}
                placeholder="Enter address"
                multiline
                numberOfLines={3}
                onFocus={() => setHelpTextVisible('address')}
              />
              {helpText.address && (
                <Text style={styles.helpText}>Include door no & street</Text>
              )}

              {/* Product / Service */}
              <Input
                label="Product"
                value={myproduct}
                onChangeText={setProduct}
                placeholder="Enter product"
                onFocus={() => setHelpTextVisible('product')}
              />
              {helpText.product && (
                <Text style={styles.helpText}>
                  Mention key products/services
                </Text>
              )}

              {/* Landline */}
              <Input
                label="Landline"
                value={mylandLine}
                onChangeText={handleLandline}
                placeholder="Enter landline number"
                keyboardType="phone-pad"
                onFocus={() => setHelpTextVisible('landline')}
              />
              {helpText.landline && (
                <Text style={styles.helpText}>Optional backup contact</Text>
              )}

              {/* STD Code */}
              <Input
                label="L Code"
                value={myLcode}
                onChangeText={handleStdCode}
                placeholder="Enter L code"
                onFocus={() => setHelpTextVisible('std')}
              />
              {helpText.std && (
                <Text style={styles.helpText}>Use L code if applicable</Text>
              )}

              {/* Email */}
              <Input
                label="Email"
                value={myemail}
                onChangeText={setEmail}
                placeholder="Enter email (optional)"
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setHelpTextVisible('email')}
              />
              {helpText.email && (
                <Text style={styles.helpText}>Optional but recommended</Text>
              )}

              {/* Promo Code */}
              <Input
                label="Promo Code"
                value={mypromoCode}
                onChangeText={setPromoCode}
                placeholder="Enter promo code"
                onFocus={() => setHelpTextVisible('promocode')}
              />
              {helpText.promocode && (
                <Text style={styles.helpText}>Enter if you have one</Text>
              )}
            </>
          ) : (
            <>
              {/* Prefix Selector */}
              <View style={{marginBottom: 15}}>
                <Text style={styles.inputLabel}>Prefix *</Text>
                <View style={styles.prefixContainer}>
                  <TouchableOpacity
                    style={[
                      styles.prefixButton,
                      myprefix === 'Mr.' && styles.prefixSelected,
                    ]}
                    onPress={() => setPrefix('Mr.')}>
                    <Text
                      style={[
                        styles.prefixText,
                        myprefix === 'Mr.' && styles.prefixTextSelected,
                      ]}>
                      Mr.
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.prefixButton,
                      myprefix === 'Ms.' && styles.prefixSelected,
                    ]}
                    onPress={() => setPrefix('Ms.')}>
                    <Text
                      style={[
                        styles.prefixText,
                        myprefix === 'Ms.' && styles.prefixTextSelected,
                      ]}>
                      Ms.
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Person Name */}
              <Input
                label="Person Name *"
                value={myperson}
                onChangeText={handlePersonName}
                placeholder="Enter full name"
                onFocus={() => setHelpTextVisible('person')}
              />
              {helpText.person && (
                <Text style={styles.helpText}>Type Initial at the end</Text>
              )}

              {/* City */}
              <Input
                label="City *"
                value={mycity}
                onChangeText={handleCityName}
                placeholder="Enter city"
                onFocus={() => setHelpTextVisible('city')}
              />
              {helpText.city && (
                <Text style={styles.helpText}>Type full city name</Text>
              )}

              {/* Pincode */}
              <Input
                label="Pincode *"
                value={mypincode}
                onChangeText={handlePincode}
                placeholder="Enter 6-digit pincode"
                keyboardType="number-pad"
                maxLength={6}
                onFocus={() => setHelpTextVisible('pincode')}
              />
              {helpText.pincode && (
                <Text style={styles.helpText}>Use valid Indian pincode</Text>
              )}

              {/* Address */}
              <Input
                label="Address *"
                value={mydoorno}
                onChangeText={setDoorno}
                placeholder="Enter address"
                multiline
                
              />

              {helpText.address && (
                <Text style={styles.helpText}>Include door no & street</Text>
              )}

              {/* Email */}
              <Input
                label="Email"
                value={myemail}
                onChangeText={setEmail}
                placeholder="Enter email (optional)"
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setHelpTextVisible('email')}
              />
              {helpText.email && (
                <Text style={styles.helpText}>Optional but recommended</Text>
              )}

              {/* Promo Code */}
              <Input
                label="Promo Code"
                value={mypromoCode}
                onChangeText={setPromoCode}
                placeholder="Enter promo code"
                onFocus={() => setHelpTextVisible('promocode')}
              />
              {helpText.promocode && (
                <Text style={styles.helpText}>Enter if you have one</Text>
              )}
            </>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={insertRecord}
            activeOpacity={0.8}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  multiline,
  numberOfLines,
  onFocus,
}) => (
  <View style={{marginBottom: 15}}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      style={[
        styles.input,
        multiline && {height: 80, textAlignVertical: 'top'},
      ]}
      keyboardType={keyboardType}
      maxLength={maxLength}
      multiline={multiline}
      numberOfLines={numberOfLines}
      autoCapitalize="words"
      onFocus={onFocus}
    />
  </View>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 6,
  },
  logo: {
    width: 140,
    height: 50,
    // marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1c3c72',
  },
  dateTime: {
    marginTop: 4,
    color: '#fff',
    fontSize: 14,
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 25,
  },
  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#e6f0ff',
    borderRadius: 12,
    marginBottom: 25,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  activeToggle: {
    backgroundColor: '#3b82f6',
  },
  inactiveToggle: {
    backgroundColor: 'transparent',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeToggleText: {
    color: '#fff',
  },
  inactiveToggleText: {
    color: '#3b82f6',
  },
  inputLabel: {
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
    fontSize: 15,
  },
  input: {
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 48,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#cbd6f1',
    color: '#111',
  },
  helpText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  prefixContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  prefixButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  prefixSelected: {
    backgroundColor: '#3b82f6',
  },
  prefixText: {
    fontSize: 15,
    color: '#3b82f6',
    fontWeight: '600',
  },
  prefixTextSelected: {
    color: '#fff',
  },
});

export default Signup;