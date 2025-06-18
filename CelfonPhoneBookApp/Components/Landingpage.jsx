import React, {useContext, useState, useEffect, use} from 'react';
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
import {useFavorites} from '../Context/FavoriteContext'; // Ensure this path is correct
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const cardColors = [['#ffdf00', '#ffffe0']];
const avatarImage = require('../src/assets/images/default-profile.png');

const Card = ({
  item,
  searchQuery,
  isSearchActive,
  selectedTab,
  user,
  navigation,
  onEnquiryPress,
  onOpenFavoriteModal,
}) => {
  const [avatarUri, setAvatarUri] = useState(null);

  const handleCall = () => {
    if (user) {
      if (item?.mobileno) Linking.openURL(`tel:${item.mobileno}`);
    } else {
      Alert.alert('Login Required', 'You need to log in to make a call.', [
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
    }
  };

  const handleEnquiry = () => {
    if (user) {
      onEnquiryPress(item);
    } else {
      Alert.alert('Login Required', 'You need to log in to send an enquiry.', [
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
    }
  };

  const shouldApplyGradient = Number(item.priority) === 1 && isSearchActive;

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(
          `https://signpostphonebook.in/image_upload_for_new_database.php?id=${item.id}`,
        );
        if (response.data.success && response.data.imageUrl) {
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
  }, [item.id]);

  const renderHighlightedText = (text, query, highlightTargetText = text) => {
    if (!query || query.trim() === '' || !highlightTargetText) {
      return <Text style={styles.title}>{highlightTargetText}</Text>;
    }

    const lowerTargetText = highlightTargetText.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const parts = [];
    let lastIndex = 0;

    while (lastIndex < lowerTargetText.length) {
      const startIndex = lowerTargetText.indexOf(lowerQuery, lastIndex);
      if (startIndex === -1) {
        if (lastIndex < highlightTargetText.length) {
          parts.push(highlightTargetText.substring(lastIndex));
        }
        break;
      }

      if (startIndex > lastIndex) {
        parts.push(highlightTargetText.substring(lastIndex, startIndex));
      }

      const endIndex = startIndex + query.length;
      parts.push(
        <Text key={startIndex} style={styles.highlightText}>
          {highlightTargetText.substring(startIndex, endIndex)}
        </Text>,
      );

      lastIndex = endIndex;
    }

    return <Text style={styles.title}>{parts}</Text>;
  };

  const CardContent = (
    <>
      <View style={styles.row}>
        <Image
          source={avatarUri ? {uri: avatarUri} : avatarImage}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          {selectedTab === 'all' ? (
            item.businessname ? (
              renderHighlightedText(
                item.businessname,
                searchQuery,
                item.businessname,
              )
            ) : item.person ? (
              renderHighlightedText(item.person, searchQuery, item.person)
            ) : (
              <Text style={styles.title}>N/A</Text>
            )
          ) : selectedTab === 'product' && item.businessname ? (
            renderHighlightedText(
              item.businessname,
              searchQuery,
              item.businessname,
            )
          ) : (
            <Text style={styles.title}>N/A</Text>
          )}

          {(selectedTab === 'all' || selectedTab === 'product') && item.city && (
            <Text style={styles.city}>
              {renderHighlightedText(item.city, searchQuery, item.city)}
            </Text>
          )}

          {selectedTab === 'product' && item.product && (
            <Text style={styles.category}>
              {renderHighlightedText(item.product, searchQuery, item.product)}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cardButton} onPress={handleCall}>
          <Text style={styles.btnText}>📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardButton} onPress={handleEnquiry}>
          <Text style={styles.btnText}>💬 Enquiry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => onOpenFavoriteModal(item)}>
          <Text style={styles.favoriteText}>💚 Favorite</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return shouldApplyGradient ? (
    <LinearGradient colors={cardColors[0]} style={styles.card}>
      {CardContent}
    </LinearGradient>
  ) : (
    <View style={[styles.card, styles.nonPriorityCard]}>{CardContent}</View>
  );
};

const Landingpage = () => {
  const [selectedTab, setSelectedTab] = useState('all'); // Changed default tab to 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const {userData, user} = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const navigation = useNavigation();

  // Enquiry Modal States
  const [enquiryModalVisible, setEnquiryModalVisible] = useState(false);
  const [selectedEnquiryItem, setSelectedEnquiryItem] = useState(null);
  const [enquiryMessage, setEnquiryMessage] = useState('');

  // Favorites Modal States & Context
  const {favoriteGroups, addMember} = useFavorites(); // Get favoriteGroups from context
  const [favoriteModalVisible, setFavoriteModalVisible] = useState(false);
  const [selectedItemForFavorite, setSelectedItemForFavorite] = useState(null); // Item being added to favorite
  const [selectedFavoriteGroupIds, setSelectedFavoriteGroupIds] = useState([]); // IDs of selected groups

  // Create Group Modal States
  const [createGroupModalVisible, setCreateGroupModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const isSearchActive = searchQuery.trim().length > 0;

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
        if (Array.isArray(json)) {
          const sortedCompanies = json.sort((a, b) => b.id - a.id);
          setCompanies(sortedCompanies);

          const uniqueProducts = [
            ...new Set(
              sortedCompanies
                .filter(item => item.product?.trim())
                .map(item => item.product.trim()),
            ),
          ].sort();
          setProducts(uniqueProducts);
        } else {
          Alert.alert('Error', 'Unexpected response from server');
        }
      } catch (error) {
        Alert.alert(
          'Error',
          'Failed to load data. Please check your connection.',
        );
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
        console.error('Error fetching profile image:', err);
      }
    };
    fetchProfileImage();
  }, [userData?.id]);

  const handleExit = () => BackHandler.exitApp();

  const handleRateApp = () => {
    setExitModalVisible(false);
    Linking.openURL('market://details?id=com.celfonphonebookapp').catch(
      err => {
        console.error('Failed to open play store:', err);
        Alert.alert('Error', 'Could not open Play Store.');
      },
    );
  };

  const handleOpenEnquiryModal = item => {
    setSelectedEnquiryItem(item);
    const name = item.businessname || item.person || 'this entry';
    setEnquiryMessage(
      `Dear ${name}, We refer to your Business Listing in Signpost PHONEBOOK, MobileApp. We are interested in your Products. Please provide us with more details. Call me Thank you! Regards, ${
        userData?.businesssname || userData?.person || 'Your Name'
      }`,
    );
    setEnquiryModalVisible(true);
  };

  const handleWhatsApp = () => {
    if (selectedEnquiryItem?.mobileno) {
      Linking.openURL(
        `whatsapp://send?phone=${
          selectedEnquiryItem.mobileno
        }&text=${encodeURIComponent(enquiryMessage)}`,
      ).catch(() =>
        Alert.alert('Error', 'WhatsApp is not installed on your device.'),
      );
    } else {
      Alert.alert('Error', 'Mobile number not available for WhatsApp.');
    }
    setEnquiryModalVisible(false);
  };

  const handleModalCall = () => {
    if (selectedEnquiryItem?.mobileno) {
      Linking.openURL(`tel:${selectedEnquiryItem.mobileno}`);
    } else {
      Alert.alert('Error', 'Mobile number not available for call.');
    }
    setEnquiryModalVisible(false);
  };

  const handleSMS = () => {
    if (selectedEnquiryItem?.mobileno) {
      Linking.openURL(
        `sms:${selectedEnquiryItem.mobileno}?body=${encodeURIComponent(
          enquiryMessage,
        )}`,
      );
    } else {
      Alert.alert('Error', 'Mobile number not available for SMS.');
    }
    setEnquiryModalVisible(false);
  };

  const handleEmail = () => {
    if (selectedEnquiryItem?.email) {
      Linking.openURL(
        `mailto:${
          selectedEnquiryItem.email
        }?subject=Enquiry&body=${encodeURIComponent(enquiryMessage)}`,
      ).catch(() => Alert.alert('Error', 'No email client found.'));
    } else {
      Alert.alert('Error', 'Email address not available.');
    }
    setEnquiryModalVisible(false);
  };

  // --- Favorites Modal Handlers ---
  const handleOpenFavoriteModal = item => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'You need to log in to save to favorites.',
        [{text: 'OK', onPress: () => navigation.navigate('Login')}],
      );
      return;
    }
    setSelectedItemForFavorite(item);
    setSelectedFavoriteGroupIds([]); // Clear previous selections
    setFavoriteModalVisible(true);
  };

  const toggleFavoriteGroupSelection = groupId => {
    setSelectedFavoriteGroupIds(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId],
    );
  };

  const handleSaveFavorite = async () => {
    if (!selectedItemForFavorite || selectedFavoriteGroupIds.length === 0) {
      Alert.alert('Error', 'Please select at least one group.');
      return;
    }

    try {
      for (const groupId of selectedFavoriteGroupIds) {
        await addMember(
          groupId,
          selectedItemForFavorite.businessname || selectedItemForFavorite.person,
          selectedItemForFavorite.mobileno,
        );
      }
      Alert.alert('Success', 'Added to My List successfully!');
      setFavoriteModalVisible(false);
      setSelectedItemForFavorite(null);
      setSelectedFavoriteGroupIds([]);
    } catch (error) {
      console.error('Error saving favorite:', error);
      Alert.alert('Error', 'Failed to save to My List. Please try again.');
    }
  };

 
  const handleCreateGroup = () => {
    if (newGroupName.trim() === '') {
      Alert.alert('Error', 'Group name cannot be empty.');
      return;
    }

    
    Alert.alert('Created Group', ` "${newGroupName.trim()}"`);
    console.log(`Creating new group: ${newGroupName.trim()}`);
 

    setNewGroupName('');
    setCreateGroupModalVisible(false);
 
  };


  const renderItem = ({item}) => {
    const handleMorePress = itemData => {
      if (user) {
        navigation.navigate('Details', {selectedItem: itemData});
      } else {
        Alert.alert(
          'Login Required',
          'You need to log in to View the details.',
          [{text: 'OK', onPress: () => navigation.navigate('Login')}],
        );
      }
    };

    return (
      <TouchableOpacity onPress={() => handleMorePress(item)}>
        <Card
          item={item}
          searchQuery={searchQuery}
          isSearchActive={isSearchActive}
          selectedTab={selectedTab}
          user={user}
          navigation={navigation}
          onEnquiryPress={handleOpenEnquiryModal}
          onOpenFavoriteModal={handleOpenFavoriteModal}
        />
      </TouchableOpacity>
    );
  };

  const getFilteredData = () => {
    let baseData = [];

    if (selectedTab === 'all') {
      baseData = companies;
    } else if (selectedTab === 'product') {
      baseData = companies.filter(i => i.product?.trim());
    } else {
      baseData = companies;
    }

    let filteredBySearch = baseData.filter(item => {
      const lowerSearchQuery = searchQuery.toLowerCase();
      if (!searchQuery.trim()) {
        return true;
      }

      if (selectedTab === 'all') {
        return (
          item.businessname?.toLowerCase().includes(lowerSearchQuery) ||
          item.person?.toLowerCase().includes(lowerSearchQuery) ||
          item.product?.toLowerCase().includes(lowerSearchQuery) ||
          item.city?.toLowerCase().includes(lowerSearchQuery)
        );
      } else if (selectedTab === 'product') {
        return (
          item.product?.toLowerCase().includes(lowerSearchQuery) ||
          item.businessname?.toLowerCase().includes(lowerSearchQuery) ||
          item.city?.toLowerCase().includes(lowerSearchQuery)
        );
      }
      return false;
    });

    if (isSearchActive) {
      const priorityItems = filteredBySearch.filter(
        item => Number(item.priority) === 1,
      );
      const nonPriorityItems = filteredBySearch.filter(
        item => Number(item.priority) !== 1,
      );
      priorityItems.sort((a, b) => b.id - a.id);
      nonPriorityItems.sort((a, b) => b.id - a.id);

      return [...priorityItems, ...nonPriorityItems];
    } else {
      return baseData.sort((a, b) => b.id - a.id);
    }
  };

  const filteredData = getFilteredData();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4f9fff', '#b6d6ff']} style={styles.gradient}>
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
      </LinearGradient>

      <View style={styles.switcher}>
        {['all', 'product'].map(tab => (
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
                ? '📖 Business/Person'
                : '📦 Products'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder={
            selectedTab === 'all'
              ? 'Search by Business/Person,'
              : 'Search by Products'
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

      <FlatList
        data={filteredData}
        keyExtractor={item => item?.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No records found.</Text>}
      />

      {/* Enquiry Modal */}
      <Modal
        visible={enquiryModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEnquiryModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.enquiryModalContent}>
            <TouchableOpacity
              style={styles.enquiryCloseXButton}
              onPress={() => setEnquiryModalVisible(false)}>
              <Icon name="close" size={24} color="#555" />
            </TouchableOpacity>

            <Text style={styles.enquiryModalTitle}>
              Edit Content to Send Enquiry to{' '}
              {selectedEnquiryItem?.businessname ||
                selectedEnquiryItem?.person ||
                'N/A'}
            </Text>
            <TextInput
              style={styles.enquiryMessageInput}
              multiline
              value={enquiryMessage}
              onChangeText={setEnquiryMessage}
              placeholder="Type your message here..."
              placeholderTextColor="#999"
            />
            <View style={styles.enquiryButtonRow}>
              {selectedEnquiryItem?.mobileno && (
                <TouchableOpacity
                  style={styles.enquiryActionButton}
                  onPress={handleWhatsApp}>
                  <Icon name="logo-whatsapp" size={24} color="#25D366" />
                  <Text style={styles.enquiryButtonText}>WhatsApp</Text>
                </TouchableOpacity>
              )}
              {selectedEnquiryItem?.mobileno && (
                <TouchableOpacity
                  style={styles.enquiryActionButton}
                  onPress={handleModalCall}>
                  <Icon name="call-outline" size={24} color="#1E90FF" />
                  <Text style={styles.enquiryButtonText}>Call</Text>
                </TouchableOpacity>
              )}
              {selectedEnquiryItem?.mobileno && (
                <TouchableOpacity
                  style={styles.enquiryActionButton}
                  onPress={handleSMS}>
                  <Icon name="mail-outline" size={24} color="#FFA500" />
                  <Text style={styles.enquiryButtonText}>SMS</Text>
                </TouchableOpacity>
              )}
              {selectedEnquiryItem?.email && (
                <TouchableOpacity
                  style={styles.enquiryActionButton}
                  onPress={handleEmail}>
                  <Icon name="at-outline" size={24} color="#DB4437" />
                  <Text style={styles.enquiryButtonText}>Email</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

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

      {/* Favorites Modal */}
      <Modal
        visible={favoriteModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFavoriteModalVisible(false)}>
        <View style={styles.bottomModalOverlay}>
          <View style={styles.modalBox}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFavoriteModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalHeading}>Add to My List</Text>

            {favoriteGroups.length === 0 ? (
              <View style={styles.emptyGroupContainer}>
                <Text style={styles.emptyGroupText}>
                  No My List groups found.
                </Text>
                <TouchableOpacity
                  style={styles.createGroupPlusButton}
                  onPress={() => {
                    setFavoriteModalVisible(false); // Close current modal
                    setCreateGroupModalVisible(true); // Open create group modal
                  }}>
                  <MaterialIcons name="add-circle-outline" size={30} color="red" />
                </TouchableOpacity>
                <Text style={styles.createGroupText}>Create a new group</Text>
              </View>
            ) : (
              // Display existing favorite groups
              favoriteGroups.map(group => (
                <TouchableOpacity
                  key={group.id}
                  style={styles.checkboxRow}
                  onPress={() => toggleFavoriteGroupSelection(group.id)}>
                  <MaterialIcons
                    name={
                      selectedFavoriteGroupIds.includes(group.id)
                        ? 'check-box'
                        : 'check-box-outline-blank'
                    }
                    size={24}
                    color="red"
                  />
                  <Text style={styles.checkboxLabel}>{group.name}</Text>
                </TouchableOpacity>
              ))
            )}

            {/* Only show Save button if there are groups to select from */}
            {favoriteGroups.length > 0 && (
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  selectedFavoriteGroupIds.length === 0 && styles.disabledButton,
                ]}
                onPress={handleSaveFavorite}
                disabled={selectedFavoriteGroupIds.length === 0}>
                <Text style={styles.confirmButtonText  }>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Create New Group Modal */}
      <Modal
        visible={createGroupModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCreateGroupModalVisible(false)}>
        <View style={styles.bottomModalOverlay}>
          <View style={styles.modalBox}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCreateGroupModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalHeading}>Create New Group</Text>

            <TextInput
              style={styles.textInputForGroup}
              placeholder="Enter new group name"
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={[
                styles.confirmButton,
                newGroupName.trim() === '' && styles.disabledButton,
              ]}
              onPress={handleCreateGroup}
              disabled={newGroupName.trim() === ''}>
              <Text style={styles.confirmButtonText}>Create</Text>
            </TouchableOpacity>
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
    paddingBottom: 40,
    backgroundColor: '#F3F4F6',
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
    textAlign: 'left', // Aligned left
    marginBottom: 30,
    color: '#fff', // Changed for better contrast on gradient
  },
  gradient: {
    paddingTop: 30,
    paddingBottom: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'flex-start', // Align content to start (left)
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 6,
  },
  switcher: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#6C7BFB',
    borderRadius: 10,
    margin: 2,
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
    marginBottom: 20,
    overflow: 'hidden',
  },
  nonPriorityCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
    borderColor: '#D1D5DB',
    borderWidth: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#1F2937',
  },
  highlightText: {
    backgroundColor: '#FFF066',
    fontWeight: 'bold',
    color: '#333',
  },
  category: {
    fontSize: 14,
    marginTop: 4,
    color: '#6B7280',
  },
  rating: {
    fontSize: 14,
    marginTop: 2,
    color: '#4B5563',
  },
  phone: {
    fontSize: 14,
    marginTop: 4,
    color: '#4B5563',
  },
  city: {
    fontSize: 15,
    marginTop: 4,
    color: '#4B5563',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  cardButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  favoriteBtn: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#32CD32',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  favoriteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
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
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E7EB',
    borderWidth: 2,
    borderColor: '#6C7BFB',
    zIndex: 1,
  },
  profileIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 22.5,
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 10,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginVertical: 5,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 40,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clearButton: {
    position: 'absolute',
    right: 5,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    color: '#555',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 90,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Styles for Enquiry Modal
  enquiryModalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    position: 'relative',
  },
  enquiryCloseXButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 1,
  },
  enquiryModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  enquiryMessageInput: {
    width: '100%',
    height: 100,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#333',
  },
  enquiryButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  enquiryActionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    margin: 8,
    minWidth: 80,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  enquiryButtonText: {
    fontSize: 12,
    marginTop: 5,
    color: '#555',
    fontWeight: '600',
  },

  // Styles for Favorites Modal (renamed modalOverlay to bottomModalOverlay)
  bottomModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: '#444',
  },
  confirmButton: {
    marginTop: 15,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 1,
  },
  emptyGroupContainer: { // New style for centering empty group text and button
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyGroupText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 10, // Space between text and plus icon
  },
  createGroupPlusButton: { // New style for the plus icon
    padding: 5, // Make the touch area a bit larger
  },
  createGroupText: { // New style for "Create a new group" text
    fontSize: 14,
    color: 'red', // Or your desired accent color
    marginTop: 5,
  },
  textInputForGroup: { // New style for the group name input
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  }
});