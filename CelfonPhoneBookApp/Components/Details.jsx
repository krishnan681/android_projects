
import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import {AuthContext, AuthProvider} from './AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

const Details = ({route, navigation}) => {
  // Get the selected item passed from navigation
  const {selectedItem} = route.params;
  const {user, userData} = useContext(AuthContext);
  
  // const [location, setLocation] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const openDialpad = number => {
    let phoneUrl = `tel:${number}`;
    Linking.openURL(phoneUrl).catch(() =>
      Alert.alert('Error', 'Dial pad not supported'),
    );
  };

  const openWhatsApp = number => {
    Linking.openURL(`https://wa.me/${number}`);
  };

  const sendEmail = email => {
    Linking.openURL(`mailto:${email}`);
  };

  const sendSMS = number => {
    Linking.openURL(`sms:${number}`);
  };

  // useEffect(() => {
  //   const fetchLocation = async () => {
  //     const addressOptions = [
  //       `${selectedItem.pincode}`,
  //     ];
    
  //     let locationFound = false;
  //     for (const address of addressOptions) {
  //       console.log("Trying address:", address);
  //       const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  //       const data = await response.json();
    
  //       console.log("API Response Data:", data);
    
  //       if (data.length > 0) {
  //         // Check for a city-level result, otherwise fallback to the first result
  //         const cityResult = data.find(item => item.class === 'place' && item.type === 'city');
  //         const loc = cityResult || data[0];  // Use city-level result if found, otherwise use the first result
    
  //         setLocation({
  //           latitude: parseFloat(loc.lat),
  //           longitude: parseFloat(loc.lon),
  //           latitudeDelta: 0.01,
  //           longitudeDelta: 0.01,
  //         });
  //         locationFound = true;
  //         break;
  //       }
  //     }
    
  //     if (!locationFound) {
  //       Alert.alert("Could not find location from given address");
  //     }
  //   };
    
    
    

  //   if (selectedItem?.address && selectedItem?.city && selectedItem?.pincode) {
  //     fetchLocation();
  //   }
  // }, [selectedItem]);  // Trigger effect whenever selectedItem changes



  return (
    <ScrollView contentContainerStyle={styles.home_container}>
      <View style={styles.home_card}>
        {/* Image Section */}
        <View style={styles.home_imageContainer}>
          <Image
            source={{
              uri: 'https://w.wallhaven.cc/full/6q/wallhaven-6q3wyx.jpg',
            }}
            style={styles.home_image}
            resizeMode="cover"
          />
        </View>

        {/* Content Section */}
        <View style={styles.home_content}>
          <Text style={styles.home_title}>
            {selectedItem?.businessname ||
              selectedItem?.person ||
              'Name not found'}
          </Text>
          <Text style={styles.home_subtitle}>{selectedItem?.product}</Text>
          <Text style={styles.home_subtitle}>
            {selectedItem?.mobileno.slice(0, 5)}xxxxx
          </Text>
          <Text style={styles.home_subtitle}>
            {selectedItem?.address},{selectedItem?.city},{selectedItem?.pincode}{' '}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#6A0DAD'}]}
              onPress={() => openDialpad(selectedItem?.mobileno)}>
              <Text style={styles.buttonText}>Dial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#25D366'}]}
              onPress={() => openWhatsApp(selectedItem?.mobileno)}>
              <Text style={styles.buttonText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#FF9900'}]}
              onPress={() => sendEmail(selectedItem?.email)}>
              <Text style={styles.buttonText}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#4285F4'}]}
              onPress={() => sendSMS(selectedItem?.mobileno)}>
              <Text style={styles.buttonText}>SMS</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          {/* <View style={styles.home_buttonContainer}>
            <TouchableOpacity style={styles.home_inviteButton}>
              <Text style={styles.home_inviteButtonText}>Share</Text>
            </TouchableOpacity>
          </View> */}

          {/* Contact Section */}
          {/* <View style={styles.home_contactSection}>
            <Text style={styles.home_contactTitle}>About Us</Text>
            <Text style={styles.home_contactText}>
              {selectedItem?.description}
            </Text>
          </View> */}

          {/* Gallery & Message Button */}
          {/* <View style={styles.home_messageContainer}>
            <Text style={styles.home_siteText}>My Gallery</Text>
            <TouchableOpacity style={styles.home_messageButton}>
              <Text style={styles.home_messageButtonText}>Reviews</Text>
            </TouchableOpacity>
          </View> */}

          {/* Photos Section */}
          {/* <Text style={styles.home_profileName}>Photos</Text> */}
        </View>

        <View style={styles.Ad_text}>
          <Text style={styles.Ad_title}>See how Your Ad looks like in Printed Edition</Text>
        </View>
        {/* InnerCard1    ---    */}
        <View style={styles.InnerCard1}>
          <Text style={styles.InnerCard1home_title}>
            {selectedItem?.businessname ||
              selectedItem?.person ||
              'Name not found'}
          </Text>
          <Text style={styles.InnerCard1home_subtitle}>
            {selectedItem?.mobileno.slice(0, 5)}xxxxx
          </Text>
          <Text style={styles.InnerCard1home_subtitle}>
            {selectedItem?.product}
          </Text>
          <Text style={styles.InnerCard1home_subtitle}>
            {selectedItem?.address},{selectedItem?.city},{selectedItem?.pincode}
          </Text>
          <Text style={styles.InnerCard4home_subtitle}>
            {selectedItem?.email}
          </Text>


        </View>

         {/* InnerCard2 */}

        <View style={styles.InnerCard2}>
          <Text style={styles.InnerCard2home_title}>
            {selectedItem?.businessname ||
              selectedItem?.person ||
              'Name not found'}
          </Text>
          <Text style={styles.InnerCard2home_subtitle}>
            {selectedItem?.mobileno.slice(0, 5)}xxxxx
          </Text>
          <Text style={styles.InnerCard2home_subtitle}>
            {selectedItem?.product}
          </Text>
          <Text style={styles.InnerCard2home_subtitle}>
            {selectedItem?.address},{selectedItem?.city},{selectedItem?.pincode}
          </Text>
          <Text style={styles.InnerCard4home_subtitle}>
            {selectedItem?.email}
          </Text>
        </View>

         {/* InnerCard3 */}

        <View style={styles.InnerCard3}>
          <Text style={styles.InnerCard3home_title}>
            {selectedItem?.businessname ||
              selectedItem?.person ||
              'Name not found'}
          </Text>
          <Text style={styles.InnerCard3home_subtitle}>
            {selectedItem?.mobileno.slice(0, 5)}xxxxx
          </Text>
          <Text style={styles.InnerCard3home_subtitle}>
            {selectedItem?.product}
          </Text>
          <Text style={styles.InnerCard3home_subtitle}>
            {selectedItem?.address},{selectedItem?.city},{selectedItem?.pincode}
          </Text>
          <Text style={styles.InnerCard4home_subtitle}>
            {selectedItem?.email}
          </Text>
        </View>

         {/* InnerCard4 */}

        <View style={styles.InnerCard4}>
          <Text style={styles.InnerCard4home_title}>
            {selectedItem?.businessname ||
              selectedItem?.person ||
              'Name not found'}
          </Text>
          <Text style={styles.InnerCard4home_subtitle}>
            {selectedItem?.mobileno.slice(0, 5)}xxxxx
          </Text>
          <Text style={styles.InnerCard4home_subtitle}>
            {selectedItem?.product}
          </Text>
          <Text style={styles.InnerCard4home_subtitle}>
            {selectedItem?.address},{selectedItem?.city},{selectedItem?.pincode}
          </Text>
          <Text style={styles.InnerCard4home_subtitle}>
            {selectedItem?.email}
          </Text>
        </View>
            {/* InnerCard5 */}

        <View style={styles.InnerCard5}>
          <Text style={styles.companylogo}>Logo</Text>
          <Text style={styles.InnerCard5home_title}>
            {selectedItem?.businessname ||
              selectedItem?.person ||
              'Name not found'}
          </Text>
          <Text style={styles.InnerCard5home_subtitle}>
            {selectedItem?.mobileno.slice(0, 5)}xxxxx
          </Text>
          <Text style={styles.InnerCard5home_subtitle}>
            {selectedItem?.product}
          </Text>
          <Text style={styles.InnerCard5home_subtitle}>
            {selectedItem?.address},{selectedItem?.city},{selectedItem?.pincode}
          </Text>
          <Text style={styles.InnerCard5home_subtitle}>
            {selectedItem?.email}
          </Text>
        </View>

        {/* {location && (  */}
        {/* // <MapView */}
        {/* //   provider={PROVIDER_DEFAULT}
        //   style={styles.map}
        //   region={location}
        //   zoomEnabled={true}
        //   scrollEnabled={true} */}
        {/* // > */}
        {/* //   <Marker coordinate={location} title="Location" /> */}
        {/* // </MapView> */}
      {/* )} */}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  //ad card

  home_container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
  },
  home_card: {
    width: '100%', // Full width
    backgroundColor: '#FFFFFF',
    borderRadius: 0, // Removed rounded corners for a full-width look
    overflow: 'hidden',
  },
  home_imageContainer: {
    width: '100%',
  },
  home_image: {
    width: '100%',
    height: 200,
  },
  home_content: {
    padding: 16,
    backgroundColor: '#FCE7F3',
  },
  home_title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flexWrap: 'wrap',
    // marginBottom: 8,
  },
  home_subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B21A8',
    marginBottom: 8,
  },
  home_buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  home_inviteButton: {
    backgroundColor: 'white',
    borderColor: '#6B21A8',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  home_inviteButtonText: {
    color: '#6B21A8',
    fontWeight: 'bold',
  },
  home_chatButton: {
    backgroundColor: '#EF4444',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  home_chatButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  home_contactSection: {
    marginBottom: 16,
  },
  home_contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  home_contactText: {
    color: '#4B5563',
    //   textAlign: 'center',
  },
  home_messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  home_siteText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  home_messageButton: {
    backgroundColor: 'white',
    borderColor: '#6B21A8',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  home_messageButtonText: {
    color: '#6B21A8',
    fontWeight: 'bold',
  },
  home_profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 10,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 6,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    // fontSize: 16,
  },

  Ad_text: {
    padding: 16,
    backgroundColor: '#F3F4F6',
  },

  Ad_title: {
    fontSize: 18,
    fontWeight: '600',
  },

  //innerCard1

  InnerCard1: {
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderRadius: 10,
  },

  InnerCard1home_title: {
    fontSize: 16,
    fontWeight: 'bold',
    // color:'#Ff00ff',
  },
  InnerCard1home_subtitle: {
    fontSize: 14,
  },

  //innerCard2
  InnerCard2: {
    padding: 16,
    margin: 16,
    borderWidth: 3,
    borderRadius: 10,
  },

  InnerCard2home_title: {
    fontSize: 18,
    fontWeight: '900',
    // color:'#Ff00ff',
  },
  InnerCard2home_subtitle: {
    fontSize: 14,
  },

  //innerCard3

  InnerCard3: {
    padding: 16,
    margin: 16,
    borderWidth: 3,
    borderRadius: 10,
  },

  InnerCard3home_title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#Ff00ff',
  },
  InnerCard3home_subtitle: {
    fontSize: 14,
  },

  companylogo: {
    left: "38%",
    margin: 10,
    padding: 10,
    borderRadius: 50,
    borderWidth: 2,
    width: 60,
    textAlign: "center",
    backgroundColor: "white",
    fontSize: 15,
    color: "black",
    fontWeight:'700',

  },

  // InnerCard4

  InnerCard4: {
    padding: 16,
    margin: 16,
    borderWidth: 3,
    borderRadius: 10,
    backgroundColor: 'pink',
  },

  InnerCard4home_title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#Ff00ff',
  },

  InnerCard4home_subtitle: {
    fontSize: 14,
  },


  // InnerCard5|

  InnerCard5: {
    padding: 16,
    margin: 16,
    borderWidth: 3,
    borderRadius: 10,
    backgroundColor: 'pink',
  },

  InnerCard5home_title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#Ff00ff',
  },

  InnerCard5home_subtitle: {
    fontSize: 14,
  },


   map: {
    width: '100%',
    height: 300,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },

});

export default Details;
