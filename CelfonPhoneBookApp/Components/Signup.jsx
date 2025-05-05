// =============================== updated signup page ======================================
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Button,
  Image,
} from "react-native";
// import RNPickerSelect from "react-native-picker-select";
import { RadioButton } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import { KeyboardAvoidingView, Platform } from "react-native";


const Signup = ({ navigation }) => {
  const [mypromoCode, setPromoCode] = useState("");
  const [mybusinessname, setBusinessname] = useState("");
  const [myaddress, setAddress] = useState("");
  const [myperson, setPerson] = useState("");
  const [mycity, setCity] = useState("");
  const [mydoorno, setDoorno] = useState("");
  const [mypincode, setPincode] = useState("");
  const [myproduct, setProduct] = useState("");
  const [mylandLine, setLandLine] = useState("");
  const [myLcode, setLcode] = useState("");
  const [myemail, setEmail] = useState("");
  const [myprefix, setPrefix] = useState("");
  const [mymobileno, setMobileno] = useState("");
  const [showMobiletext, setshowMobiletext] = useState(false);
  const [showbusinesstext, setShowBusinesstext] = useState(false);
  const [regName, setRegName] = useState("");
  const [regPrefix, setRegPrefix] = useState("");
  const [regBusinessName, setRegBusinessName] = useState("");
  const [regBusinessPrefix, setRegBusinessPrefix] = useState("");
  const [showPersonName, setShowPersonName] = useState(false);
  const [showprefixtext, setShowPrefixText] = useState(false);
  const [showAddressText, setshowAddressText] = useState(false);
  const [showCityText, setshowCityText] = useState(false);
  const [showPincodeText, setshowPincodeText] = useState(false);
  const [showProductText, setshowProductText] = useState(false);
  const [showLandlineText, setshowLandlineText] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showStdText, setshowStdText] = useState(false);
  const [showEmailText, setshowEmailText] = useState(false);
  const [showPromoText, setshowPromoText] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  const mypriority = "0";
  const mydiscount = "10";
  const mydescription = "Update Soon";
  const cmpanyPrefix = "M/s.";

  const [dateTime, setDateTime] = useState("");

  const updateDateTime = () => {
    const now = new Date();

    // Format date
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate = now.toLocaleDateString(undefined, options);

    // Format time
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes
      } ${ampm}`;

    // Combine date and time
    setDateTime(`${formattedDate} ${formattedTime}`);
  };

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const resetForm = () => {
    setBusinessname("");
    setMobileno("");
    setPrefix("");
    setAddress("");
    setPerson("");
    setPincode("");
    setCity("");
    setProduct("");
    setLandLine("");
    setLandLine("");
    setLcode("");
    setEmail("");
    setPromoCode("");
  };

  const handleBusinessName = (e) => {
    const businessName = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(businessName)) {
      setBusinessname(businessName);
    }
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


   // for Pincode number

   const handlePincode = text => {
    const numericText = text.replace(/[^0-9]/g, ''); // Allow only numbers
    setPincode(numericText);
  };


  const handlePersonName = (e) => {
    const personName = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(personName)) {
      setPerson(personName);
    }
  };
  const handlePopup = (e) => {
    e.preventDefault();
    setShowPopup(false);
    navigate("/login");
    resetForm();
  };

  const handleClosePopup1 = (e) => {
    e.preventDefault();
    setShowPopup1(false);
  };
  const handleCityName = (e) => {
    const cityName = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(cityName)) {
      setCity(cityName);
    }
  };

    // `https://signpostphonebook.in/client_insert_data_for_new_database.php`,


    const checkMobileNumber = async (mobile) => {
      try {
        const response = await fetch(
          `https://signpostphonebook.in/client_insert_data_for_new_database.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ mobileno: mobile }),
          }
        );
        const result = await response.json();
        console.log("Check Mobile Response:", result);
    
        if (result.registered) {
          setIsRegistered(true);
          Alert.alert(
            "Mobile Number Exists",
            `This mobile number is already registered under the name: ${result.businessname || result.person || "Unknown"}`
          );
          setMobileno("");
        } else {
          setIsRegistered(false);
        }
      } catch (error) {
        console.error("Error checking mobile:", error);
        Alert.alert("Error", "Unable to verify mobile number.");
      }
    };
    

  // Insert new record if the mobile number is not registered
  const insertRecord = async () => {
    if (isRegistered) {
      Alert.alert("Error", "Mobile number is already registered.");
      return;
    }
    // Frontend validation for required fields
    if (
      !mybusinessname ||
      !mydoorno ||
      !mycity ||
      !mypincode ||
      !myprefix ||
      !mymobileno
    ) {
      Alert.alert("Validation Error", "Please enter all required fields.");
      return;
    }

    const Data = {
      businessname: mybusinessname,
      doorno: mydoorno,
      city: mycity,
      pincode: mypincode,
      prefix: myprefix,
      mobileno: mymobileno,
      email: myemail,
      product: myproduct,
      landline: mylandLine,
      lcode: myLcode,
    };

    console.log("Sending Data:", Data);

    try {
      const response = await fetch(
        "https://signpostphonebook.in/client_insert_data_for_new_database.php",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Data),
        }
      );

      const jsonResponse = await response.json();
      console.log("Server Response:", jsonResponse);

      if (jsonResponse.Message) {
        Alert.alert("Success", jsonResponse.Message);
        navigation.navigate("Login");
        setBusinessname("");
        setCity("");
        setDoorno("");
        setEmail("");
        setLandLine("");
        setPincode("");
        setLcode("");
        setMobileno("");
        setPrefix("");
        setProduct("");
      } else {
        Alert.alert("Error", "Unexpected response from server.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Error", error.message);
    }
  };
  

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
    promocode:false,
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
      promocode:false,
    });
  };

  // Set specific help text
  const setHelpTextVisible = (field) => {
    resetAllHelpTexts();
    setHelpText((prev) => ({ ...prev, [field]: true }));
  };

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Gradient Background Only at the Top */}
        <LinearGradient colors={["#FF69B4", "#FFFFFF"]} style={styles.topSection}>
          <Image
            source={require('../src/assets/images/comaany-logo.png')} // Replace with your logo
            style={styles.logo}
            resizeMode="contain"
          />
        </LinearGradient>

        {/* White Card Covering Bottom Section */}
        <View style={styles.card}>
          <Text style={styles.header}>
            <Text style={styles.signupText}>Sign Up</Text> to create an account.
          </Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

            <Text style={styles.label}>Mobile Number* :</Text>
            <TextInput
              placeholder="Mobile Number"
              keyboardType="number-pad"
              maxLength={10}
              style={styles.input}
              value={mymobileno}
              onChangeText={(text) => setMobileno(text)}
              onEndEditing={() => checkMobileNumber(mymobileno)}
              onFocus={() => setHelpTextVisible("mobile")}
            />
            {helpText.mobile && (
              <Text style={styles.helpText}>
                Type 10 digits without Country code (+91), without gap Don't Type Land Line
              </Text>
            )}
            

           
            <Text style={styles.label}> Person Name* :</Text>
            <TextInput
              placeholder="Person"
              style={styles.input}
              onChangeText={(text) => setPerson(text)}
              value={myperson}
              onFocus={() => setHelpTextVisible("person")}

            />
            {helpText.person && (
              <Text style={styles.helpText}>
                Type Initial at the end
              </Text>
            )}

            <Text style={styles.label}>Prefix*:</Text>
            <RadioButton.Group
              onValueChange={(value) => {
                setPrefix(value)
                setHelpTextVisible("prefix")
              }}
              value={myprefix}
            >
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
            {helpText.prefix && (
              <Text style={styles.helpText}>Select Mr. For Gents and Ms. for Ladies</Text>
            )}

            <Text style={styles.label}>Business Name* :</Text>
            <TextInput
              placeholder="Business Name"
              style={styles.input}
              onChangeText={(text) => setBusinessname(text)}
              value={mybusinessname}
              onFocus={() => setHelpTextVisible("business")}
            />
            {helpText.business && (
              <Text style={styles.helpText}>Type Your FirmName or BusinessName</Text>
            )}            



            <Text style={styles.label}>City* :</Text>
            <TextInput
              placeholder="City"
              style={styles.input}
              onChangeText={(text) => setCity(text)}
              value={mycity}
              onFocus={() => setHelpTextVisible("cityName")}
            />
            {helpText.cityName && (
              <Text style={styles.helpText}>Type City Name. Don't Use Petnames (Kovai Etc.)</Text>
            )}

            <Text style={styles.label}>Pincode* :</Text>
            <TextInput
              placeholder="Pincode"
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
              onChangeText={handlePincode}
              value={mypincode}
              onFocus={() => setHelpTextVisible("pincode")}
            />
            {helpText.pincode && (
              <Text style={styles.helpText}>Type 6 Digits Continioulsy Without Gap</Text>
            )}


            <Text style={styles.label}>Address* :</Text>
            <TextInput
              placeholder="Address"
              style={[styles.input, { height: 80 }]}
              multiline
              onChangeText={(text) => setDoorno(text)}
              value={mydoorno}
              onFocus={() => setHelpTextVisible("address")}
            />
            {helpText.address && (
              <Text style={styles.helpText}>Type Door Number, Street, Flat No, Appartment Name, Landmark, Area Name etc.</Text>
            )}
            
            <Text style={styles.label}>Product / Service* :</Text>
            <TextInput
              placeholder="Product"
              style={styles.input}
              onChangeText={(text) => setProduct(text)}
              value={myproduct}
              onFocus={() => setHelpTextVisible("product")}
            />
            {helpText.product && (
              <Text style={styles.helpText}>Type Correct & Specific Name of Product/Service offered. Sepparate Each Keyword By Comma. For</Text>
            )}

            <Text style={styles.label}>Landline Number :</Text>
            <TextInput
              placeholder="Landline Number"
              keyboardType="number-pad"
              style={styles.input}
              onChangeText={handleLandline}
              value={mylandLine}
              onFocus={() => setHelpTextVisible("landline")}
            />

            {helpText.landline && (
              <Text style={styles.helpText}>Type Only Landline, if Available. Don't Type Mobile Number here.</Text>
            )}

            <Text style={styles.label}>STD Code :</Text>
            <TextInput
              placeholder="STD Code"
              keyboardType="number-pad"
              style={styles.input}
              onChangeText={handleStdCode}
              value={myLcode}
              onFocus={() => setHelpTextVisible("std")}
            />
            {helpText.std && (
              <Text style={styles.helpText}>Type Only Landline, if Available. Don't Type Mobile Number here.</Text>
            )}

            <Text style={styles.label}>Email :</Text>
            <TextInput
              style={styles.input}
              placeholder="example@mail.com"
              keyboardType="email-address"
              value={myemail}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
              onFocus={() => setHelpTextVisible("email")}
            />

            {helpText.email && (
              <Text style={styles.helpText}>Type Correctly, Only If Available</Text>
            )}
            
            <Text style={styles.label}>Promo-Code :</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Promo code"
              keyboardType="text"
              value={mypromoCode}
              onChangeText={(text) => setPromoCode(text)}
              autoCapitalize="none"
              onFocus={() => setHelpTextVisible("promocode")}
            />
            {helpText.promocode && (
              <Text style={styles.helpText}>Enter name or Number Who is referred to this App!</Text>
            )}

            <TouchableOpacity style={styles.signupButton} onPress={insertRecord}>
              <Text style={styles.signupButtonText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>

    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  topSection: {
    height: "20%", // Covers the top area
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    top:-20,
    width: 150,
    height: 50,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
    marginTop: -50,
    elevation: 5,
    minHeight: "75%",  // Ensure enough space
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  signupText: {
    color: "#aa336a",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 5,
    marginVertical: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-evenly"
  },
  signupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#aa336a",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  signupButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,

  },
  loginText: {
    color: "#000",
    fontSize:20,

  },
  loginLink: {
    color: "#aa336a",
    fontWeight: "bold",
    fontSize:20

  },
  helpText:{
    color:"red",
    fontSize:16,
  }
});


export default Signup;