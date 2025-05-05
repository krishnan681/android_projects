import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const Account = () => {
  const { userData, setUserData, logout } = useContext(AuthContext);
  const [editableDetails, setEditableDetails] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (userData) {
      setEditableDetails(userData);
    }
  }, [userData]);

  const handleChange = (name, value) => {
    setEditableDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!editableDetails.id) {
        setError('User ID is missing. Cannot update profile.');
        return;
      }

      const payload = { ...editableDetails, id: userData.id };
      console.log('Payload being sent to server:', payload);

      const response = await axios.post(
        'https://signpostphonebook.in/try_update_profile_for_new_database.php',
        payload
      );

      if (response.data.success) {
        setUserData && setUserData((prevData) => ({ ...prevData, ...payload }));
        setError('');
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        setError(response.data.message || 'Failed to save changes.');
        Alert.alert('Error', response.data.message || 'Update failed.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Something went wrong. Please try again later.');
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Prefix"
        value={editableDetails.prefix || editableDetails.personprefix || ''}
        onChangeText={(text) => handleChange('prefix', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={editableDetails.businessname || editableDetails.person || ''}
        onChangeText={(text) => {
          handleChange('businessname', text);
          handleChange('person', text);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Product"
        value={editableDetails.product || ''}
        onChangeText={(text) => handleChange('product', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={editableDetails.address || ''}
        onChangeText={(text) => handleChange('address', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={editableDetails.city || ''}
        onChangeText={(text) => handleChange('city', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Pincode"
        keyboardType="numeric"
        value={editableDetails.pincode?.toString() || ''}
        onChangeText={(text) => handleChange('pincode', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={editableDetails.email || ''}
        onChangeText={(text) => handleChange('email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={editableDetails.description || ''}
        onChangeText={(text) => handleChange('description', text)}
      />

      <View style={styles.buttonRow}>
        <Button title="Save" color="green" onPress={handleSave} />
        <View style={{ width: 10 }} />
        <Button title="Logout" color="red" onPress={logout} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 12,
  },
  error: {
    color: 'red',
    marginTop: 16,
  },
});

export default Account;
