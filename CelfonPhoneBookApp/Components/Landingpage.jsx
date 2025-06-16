import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
  BackHandler,
  Modal,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {AuthContext} from './AuthContext';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const cardColors = [['#ffdf00', '#ffffe0']];

const avatarImage = require('../src/assets/images/default-profile.png');

const Card = ({item, isPerson, index}) => {
  const [avatarUri, setAvatarUri] = useState(null);

  const handleCall = () => {
    if (item?.mobileno) Linking.openURL(`tel:${item.mobileno}`);
  };

  const handleEnquiry = () => {
    const name = isPerson ? item.person : item.businessname;
    const message = `Hi, I have an enquiry regarding ${name}`;
    if (item?.mobileno) {
      Linking.openURL(
        `sms:${item.mobileno}?body=${encodeURIComponent(message)}`,
      );
    }
  };

  const gradient = cardColors[index % cardColors.length];

  useEffect(() => {
    console.log('Fetching profile image for item:', item.id);

    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(
          `https://signpostphonebook.in/image_upload_for_new_database.php?id=${item.id}`,
        );
        if (response.data.success && response.data.imageUrl) {
          // console.log('Profile image URL:', response.data.imageUrl);
          const imageUrl = response.data.imageUrl.startsWith('http')
            ? response.data.imageUrl
            : `https://signpostphonebook.in/${response.data.imageUrl}`;
          setAvatarUri(`${imageUrl}`);
        } else {
          setAvatarUri(null);
        }
      } catch (error) {
        setAvatarUri(null);
      }
    };

    if (item.id) {
      fetchProfileImage();
    }
  }, []);

  return isPerson ? (
    <View style={[styles.card, styles.personCardBorder]}>
      <View style={styles.row}>
        <Image
          source={avatarUri ? {uri: avatarUri} : avatarImage}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.person}</Text>
          <Text style={styles.phone}>{item.mobileno}</Text>
          {/* {!!item.city && <Text style={styles.city}>{item.city}</Text>} */}
        </View>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.personbtn} onPress={handleCall}>
          <Text style={styles.btnText}>📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.personbtn} onPress={handleEnquiry}>
          <Text style={styles.btnText}>💬 Enquiry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteBtn}>
          <Text style={styles.favoriteText}>💚 Favorite</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <LinearGradient colors={gradient} style={styles.card}>
      <View style={styles.row}>
        <Image
          source={avatarUri ? {uri: avatarUri} : avatarImage}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.businessname}</Text>
          <Text style={styles.category}>{item.product || 'N/A'}</Text>
          {!!item.rating && <Text style={styles.rating}>⭐ {item.rating}</Text>}
          <Text style={styles.phone}>{item.mobileno}</Text>
          {/* {!!item.city && <Text style={styles.city}>{item.city}</Text>} */}
        </View>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.businessbtn} onPress={handleEnquiry}>
          <Text style={styles.btnText}>💬 Enquiry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteBtn}>
          <Text style={styles.favoriteText}>💚 Favorite</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.businessbtn} onPress={handleCall}>
          <Text style={styles.btnText}>📞 Call</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const Landingpage = () => {
  const [selectedTab, setSelectedTab] = useState('business');
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const {userData} = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setExitModalVisible(true);
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => backHandler.remove();
    }, []),
  );

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(
          'https://signpostphonebook.in/client_fetch_for_new_database.php',
        );
        const json = await res.json();
        if (Array.isArray(json)) setCompanies(json.sort((a, b) => b.id - a.id));
        else Alert.alert('Error', 'Unexpected response from server');
      } catch {
        Alert.alert('Error', 'Failed to load data');
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!userData?.id) return;
      try {
        const res = await axios.get(
          `https://signpostphonebook.in/image_upload_for_new_database.php?id=${userData.id}`,
        );
        if (res.data.success && res.data.imageUrl) {
          const url = res.data.imageUrl.startsWith('http')
            ? res.data.imageUrl
            : `https://signpostphonebook.in/${res.data.imageUrl}`;
          setProfileImage(`${url}?t=${Date.now()}`);
        }
      } catch (err) {
        console.error('Profile image fetch failed', err);
      }
    };
    fetchProfileImage();
  }, [userData?.id]);

  const handleExit = () => BackHandler.exitApp();

  const handleRateApp = () => {
    setExitModalVisible(false);
    Linking.openURL('market://details?id=com.celfonphonebookapp').catch(
      console.error,
    );
  };

  const filterBySearch = items => {
    return items.filter(item => {
      const name = item.businessname || item.person || '';
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  const getFilteredData = () => {
    let filtered = [];

    if (selectedTab === 'business') {
      filtered = companies.filter(i => i.businessname?.trim());
    } else if (selectedTab === 'person') {
      filtered = companies.filter(i => !i.businessname && i.person?.trim());
    } else {
      filtered = companies;
    }

    return filterBySearch(filtered);
  };

  const filteredData = getFilteredData();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Signpost Phonebook</Text>

      <TouchableOpacity
        style={styles.profileIconContainer}
        onPress={() => {
          if (userData?.id) navigation.navigate('Profile');
          else
            Alert.alert(
              'Login Required',
              'You need to log in to view your Profile.',
              [{text: 'OK', onPress: () => navigation.navigate('Login')}],
            );
        }}>
        <Image
          source={profileImage ? {uri: profileImage} : avatarImage}
          style={styles.profileIcon}
        />
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.switcher}>
        {['all', 'business', 'person'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => {
              setSelectedTab(tab);
              setSearchQuery('');
            }}>
            <Text
              style={
                selectedTab === tab ? styles.activeTabText : styles.tabText
              }>
              {tab === 'all'
                ? '📋 All'
                : tab === 'business'
                ? '📇 Businesses'
                : '👤 Persons'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder={
            selectedTab === 'all'
              ? 'Search all...'
              : selectedTab === 'business'
              ? 'Search businesses...'
              : 'Search persons...'
          }
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}>
            <Icon name="close-circle" size={22} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Cards */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item?.id?.toString() || Math.random().toString()}
        renderItem={({item, index}) => (
          <Card
            item={item}
            index={index}
            isPerson={!item.businessname && !!item.person}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No records found.</Text>}
      />

      {/* Exit Modal */}
      <Modal visible={exitModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Exit App</Text>
            <Text style={styles.modalMessage}>
              Do you want to exit or rate the app?
            </Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                onPress={handleRateApp}
                style={[styles.modalButton, {backgroundColor: '#4CAF50'}]}>
                <Text style={styles.modalButtonText}>Rate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setExitModalVisible(false)}
                style={[styles.modalButton, {backgroundColor: '#2196F3'}]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleExit}
                style={[styles.modalButton, {backgroundColor: '#f44336'}]}>
                <Text style={styles.modalButtonText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Landingpage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  switcher: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#6C7BFB',
  },
  tabText: {
    fontWeight: '600',
    color: '#555',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
    elevation: 5,
  },
  personCardBorder: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF69B4',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  category: {
    fontSize: 14,
    marginTop: 2,
  },
  rating: {
    fontSize: 14,
    marginTop: 2,
  },
  phone: {
    fontSize: 14,
    marginTop: 4,
  },
  city: {
    fontSize: 13,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  businessbtn: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  personbtn: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#1E90FF',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    // color: '#fff',
    fontWeight: '600',
  },
  favoriteBtn: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#32CD32',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  favoriteText: {
    color: '#fff',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#888',
  },
  profileIconContainer: {
    position: 'absolute',
    top: 30,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  //search

  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 10,
    position: 'relative',
  },

  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,

    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 40,
    fontSize: 16,
    color: '#333',
  },

  clearButton: {
    position: 'absolute',
    right: 10,
    top: '30%',
  },

  //exit modal styles

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
