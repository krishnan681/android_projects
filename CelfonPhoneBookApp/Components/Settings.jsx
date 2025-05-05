import {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from './AuthContext';

const Settings = ({navigation}) => {
  const {user, userData, logout} = useContext(AuthContext);

  // Check if user is logged in
  const isLoggedIn = user !== '';
  const displayName = isLoggedIn
    ? userData.businessname || userData.person
    : 'Guest User';

  // Define the mobile number of the admin and shop owner
  const adminMobileNumbers = [
    '6383965890',
    '8344508070',
    '9843657564',
    '6383463820',
  ]; // Change this to the actual admin number
  const shopOwnerMobileNumber = ['8300705411', '6383463820']; // Shop owner's number

  // Check if the logged-in user is an admin
  const isAdmin = isLoggedIn && adminMobileNumbers.includes(userData.mobileno);

  // Check if the logged-in user is the shop owner
  // Check if the logged-in user is the shop owner
const isShopOwner = isLoggedIn && shopOwnerMobileNumber.includes(userData.mobileno);


  // Function to show logout confirmation
  const confirmLogout = () => {
    Alert.alert('Logout Confirmation', 'Do you really want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'OK', onPress: () => logout(navigation)},
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* General Section */}
      <Text style={styles.sectionTitle}>GENERAL</Text>
      {isLoggedIn && (
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('Account')}>
          <Icon name="person-outline" size={24} color="#aa336a" />
          <Text style={styles.optionText}>Account</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('Notifications')}>
        <Icon name="notifications-outline" size={24} color="#aa336a" />
        <Text style={styles.optionText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('Coupons')}>
        <Icon name="gift-outline" size={24} color="#aa336a" />
        <Text style={styles.optionText}>Coupons</Text>
      </TouchableOpacity>

      {/* Show Admin Page Option for Admin Users */}
      {isAdmin && (
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('AdminPage')}>
          <Icon name="settings-outline" size={24} color="red" />
          <Text style={[styles.optionText, {color: 'red'}]}>Admin Page</Text>
        </TouchableOpacity>
      )}

      {isAdmin && (
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('Icecream')}>
          <Icon name="ice-cream-outline" size={24} color="red" />
          <Text style={[styles.optionText, {color: 'red'}]}>Icecream</Text>
        </TouchableOpacity>
      )}

      {/* Show Ice Cream Transaction Page for Shop Owner */}
      {isShopOwner && (
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('IceCreamTransaction')}>
          <Icon name="ice-cream-outline" size={24} color="blue" />
          <Text style={[styles.optionText, {color: 'blue'}]}>
            Ice-Cream Transactions
          </Text>
        </TouchableOpacity>
      )}

      {isLoggedIn && (
        <TouchableOpacity style={styles.option} onPress={confirmLogout}>
          <Icon name="log-out-outline" size={24} color="#aa336a" />
          <Text style={[styles.optionText, {color: 'red'}]}>Logout</Text>
        </TouchableOpacity>
      )}

      {/* Feedback Section */}
      <Text style={styles.sectionTitle}>FEEDBACK</Text>
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('ReportBug')}>
        <Icon name="alert-circle-outline" size={24} color="#aa336a" />
        <Text style={styles.optionText}>Report a Bug</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('SendFeedback')}>
        <Icon name="send-outline" size={24} color="#aa336a" />
        <Text style={styles.optionText}>Send Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('UserGuide')}>
        <Icon name="book-outline" size={24} color="#aa336a" />
        <Text style={styles.optionText}>User Guide</Text>
      </TouchableOpacity>

      {/* Show Login & Sign Up if not logged in */}
      {!isLoggedIn && (
        <View>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate('Login')}>
            <Icon name="log-in-outline" size={24} color="white" />
            <Text style={styles.authText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate('Signup')}>
            <Icon name="person-add-outline" size={24} color="white" />
            <Text style={styles.authText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>FOLLOW US</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://instagram.com/yourprofile')}>
          <Icon
            name="logo-instagram"
            size={30}
            color="#C13584"
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://facebook.com/yourprofile')}>
          <Icon
            name="logo-facebook"
            size={30}
            color="#3b5998"
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://linkedin.com/in/yourprofile')
          }>
          <Icon
            name="logo-linkedin"
            size={30}
            color="#0077B5"
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://linkedin.com/in/yourprofile')
          }>
          <Icon
            name="logo-youtube"
            size={30}
            color="#FF0000"
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Android version 1.0 </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#aa336a',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    elevation: 3,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#aa336a',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#aa336a',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
  },
  authText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },

  version: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  socialIcon: {
    marginHorizontal: 10,
  },
});

export default Settings;
