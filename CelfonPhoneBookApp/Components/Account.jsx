import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  PermissionsAndroid,
  Platform,
  Dimensions,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {AuthContext} from './AuthContext';

const defaultImage = 'https://signpostphonebook.in/default_profile.png';
const {width, height} = Dimensions.get('window');

const Account = () => {
  const {userData, setUserData, logout} = useContext(AuthContext);
  const [editableDetails, setEditableDetails] = useState({});
  const [profileImage, setProfileImage] = useState(defaultImage);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(true);

  useEffect(() => {
    if (userData) {
      setEditableDetails(userData);
      setProfileImage(userData.image || defaultImage);
    }
  }, [userData]);

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
      Alert.alert('Profile Image Fetch Error:', error);
    }
  };

  useEffect(() => {
    if (!userData?.id) return;
    fetchProfileImage();
  }, [userData]);

  useEffect(() => {
    const requiredFields = [
      'prefix',
      'businessname',
      'product',
      'address',
      'city',
      'pincode',
      'email',
      'description',
    ];

    const isComplete = requiredFields.every(field =>
      (editableDetails[field] ||
        editableDetails[
          field === 'prefix'
            ? 'personprefix'
            : field === 'businessname'
            ? 'person'
            : ''
        ])?.trim(),
    );

    setIsProfileComplete(isComplete);
  }, [editableDetails]);

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

  const changeProfileImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    const response = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: false,
    });

    if (response?.assets?.length > 0) {
      const selectedImage = response.assets[0];
      setProfileImage(selectedImage.uri);
    }
  };

  const handleChange = (name, value) => {
    setEditableDetails(prev => ({...prev, [name]: value}));
  };

  const handleSave = async () => {
    try {
      if (!editableDetails.id) {
        setError('User ID is missing. Cannot update profile.');
        return;
      }

      const payload = {...editableDetails, id: userData.id};

      const response = await axios.post(
        'https://signpostphonebook.in/try_update_profile_for_new_database.php',
        payload,
      );

      if (response.data.success) {
        setUserData(prevData => ({...prevData, ...payload}));
        setError('');
        Alert.alert('Success', 'Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(response.data.message || 'Failed to save changes.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    }
  };

  const handleCancel = () => {
    setEditableDetails(userData);
    setProfileImage(userData.image || defaultImage);
    setIsEditing(false);
    setError('');
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.topCircle} />
      <View style={styles.bottomCurve} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={{uri: profileImage || defaultImage}}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.cameraIconWrapper}
            onPress={changeProfileImage}>
            <Icon name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.heading}>Account</Text>
          {!isEditing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Input Fields */}
        {[
          {label: 'Prefix', key: 'prefix', fallback: 'personprefix'},
          {label: 'Name', key: 'businessname', fallback: 'person'},
          {label: 'Product', key: 'product'},
          {label: 'Address', key: 'address'},
          {label: 'City', key: 'city'},
          {label: 'Pincode', key: 'pincode', keyboardType: 'numeric'},
          {label: 'Email', key: 'email', keyboardType: 'email-address'},
        ].map(field => (
          <View style={styles.inputGroup} key={field.key}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={
                editableDetails[field.key] ||
                editableDetails[field.fallback] ||
                ''
              }
              onChangeText={text => {
                handleChange(field.key, text);
                if (field.fallback) handleChange(field.fallback, text);
              }}
              editable={isEditing}
              keyboardType={field.keyboardType || 'default'}
            />
          </View>
        ))}

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.Descinput}
            multiline
            value={editableDetails.description || ''}
            onChangeText={text => handleChange('description', text)}
            editable={isEditing}
          />
        </View>

        {/* Buttons */}
        {isEditing && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#6c757d'}]}
              onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#28a745'}]}
              onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Error and Incomplete Warning */}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!isProfileComplete && !isEditing && (
          <Text style={styles.incompleteWarning}>
            Your profile is incomplete.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  topCircle: {
    position: 'absolute',
    top: -height * 0.15,
    left: -width * 0.3,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#007bff',
  },
  bottomCurve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    height: 100,
    backgroundColor: '#007bff',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: width / 2 - 60,
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  Descinput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 15,
  },
  incompleteWarning: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Account;
