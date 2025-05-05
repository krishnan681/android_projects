import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from './AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

const Icecream = () => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();

  const [shopData, setShopData] = useState([]); // Data for Transaction Table
  const [ownerData, setOwnerData] = useState([]); // Data for Show Owner Table
  const [infoData, setInfoData] = useState([]); // Data for Information Table
  const [loading, setLoading] = useState(true);
  const [isTransactionExpanded, setIsTransactionExpanded] = useState(false);
  const [isOwnerExpanded, setIsOwnerExpanded] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false); // New state for Information Table

  const components = [
    {
      id: 1,
      name: 'Add Buyer',
      image: require('../src/assets/images/Buyer.png'),
      route: 'BuyerInformation',
    },
    {
      id: 2,
      name: 'Add Shop Owner',
      image: require('../src/assets/images/Shop.png'),
      route: 'ShopOwnerInformation',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for transaction table
        const responseTransaction = await fetch(
          'https://signpostphonebook.in/icecream/fetch_ice_cream_transaction.php',
        );
        const jsonTransaction = await responseTransaction.json();
        if (jsonTransaction.success) {
          setShopData(jsonTransaction.data);
        } else {
          Alert.alert(
            'Error',
            jsonTransaction.message || 'Failed to fetch data',
          );
        }

        // Fetch data for show owner table
        const responseOwner = await fetch(
          'https://signpostphonebook.in/icecream/fetch_shop_owner_details.php', // Different API URL
        );
        const jsonOwner = await responseOwner.json();
        if (jsonOwner.success) {
          setOwnerData(jsonOwner.data);
        } else {
          Alert.alert('Error', jsonOwner.message || 'Failed to fetch data');
        }

        // Fetch data for information table
        const responseInfo = await fetch(
          'https://signpostphonebook.in/icecream/fetch_information_table.php', // Another Different API URL for Information Table
        );
        const jsonInfo = await responseInfo.json();
        if (jsonInfo.success) {
          setInfoData(jsonInfo.data);
        } else {
          Alert.alert('Error', jsonInfo.message || 'Failed to fetch data');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Network request failed');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderButtons = () =>
    components.map(item => (
      <TouchableOpacity
        key={item.id}
        style={styles.item}
        onPress={() => {
          if (user) {
            navigation.navigate(item.route);
          } else {
            Alert.alert('Login Required', 'Please login to view this item.');
            navigation.navigate('Login');
          }
        }}>
        <View style={styles.avatarContainer}>
          <Image source={item.image} style={styles.avatar} />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <Icon name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>
    ));

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Button Section */}
        <Text style={styles.listHeadLine}>Icecream Specials</Text>
        {renderButtons()}

        {/* -----------------------------Transaction Table Section------------------------------------------------------------------------- */}
        <TouchableOpacity
          onPress={() => setIsTransactionExpanded(!isTransactionExpanded)}>
          <Text style={[styles.listHeadLine, {paddingTop: 20}]}>
            Transaction Table
          </Text>
          <Icon
            name={isTransactionExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#666"
            style={styles.listHeadLineicon}
          />
        </TouchableOpacity>

        {/* Transaction Table Body */}
        {isTransactionExpanded && (
          <>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>ID</Text>
              <Text style={styles.tableCell}>Shop Owner</Text>
              <Text style={styles.tableCell}>Customer</Text>
              <Text style={styles.tableCell}>Count</Text>
              <Text style={styles.tableCell}>Date</Text>
            </View>

            {/* Table Rows */}
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#aa336a"
                style={{marginTop: 20}}
              />
            ) : shopData.length > 0 ? (
              shopData.map((item, index) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.id}</Text>
                  <Text style={styles.tableCell}>{item.shop_owner_name}</Text>
                  <Text style={styles.tableCell}>{item.customer_name}</Text>
                  <Text style={styles.tableCell}>{item.count}</Text>
                  <Text style={styles.tableCell}>{item.date}</Text>
                </View>
              ))
            ) : (
              <Text style={{textAlign: 'center', marginTop: 20}}>
                No Data Found
              </Text>
            )}
          </>
        )}

        {/* ---------------------------------------------Show Owner Table Section------------------------------------------------------------------------- */}
        <TouchableOpacity onPress={() => setIsOwnerExpanded(!isOwnerExpanded)}>
          <Text style={[styles.listHeadLine, {paddingTop: 20}]}>
            Show Owner Table
          </Text>
          <Icon
            name={isOwnerExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#666"
            style={styles.listHeadLineicon}
          />
        </TouchableOpacity>

        {/* Show Owner Table Body */}
        {isOwnerExpanded && (
          <>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Id</Text>
              <Text style={styles.tableCell}>Owner name</Text>
              <Text style={styles.tableCell}>total icecream</Text>
              <Text style={styles.tableCell}>sold icecream</Text>
              <Text style={styles.tableCell}>balance icecream</Text>
              <Text style={styles.tableCell}>Date</Text>
            </View>

            {/* Table Rows */}
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#aa336a"
                style={{marginTop: 20}}
              />
            ) : ownerData.length > 0 ? (
              ownerData.map((item, index) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.shop_owner_id}</Text>
                  <Text style={styles.tableCell}>{item.shop_owner_name}</Text>
                  <Text style={styles.tableCell}>{item.total_ice_cream}</Text>
                  <Text style={styles.tableCell}>{item.sold_ice_cream}</Text>
                  <Text style={styles.tableCell}>{item.balance_ice_cream}</Text>
                  <Text style={styles.tableCell}>{item.date}</Text>
                </View>
              ))
            ) : (
              <Text style={{textAlign: 'center', marginTop: 20}}>
                No Data Found
              </Text>
            )}
          </>
        )}

        {/* -------------------------------------------------------------------------Information Table Section-------------------------------------------------------------------------- */}
        <TouchableOpacity onPress={() => setIsInfoExpanded(!isInfoExpanded)}>
          <Text style={[styles.listHeadLine, {paddingTop: 20}]}>
            Information Table
          </Text>
          <Icon
            name={isInfoExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#666"
            style={styles.listHeadLineicon}
          />
        </TouchableOpacity>

        {/* Information Table Body */}
        {isInfoExpanded && (
          <>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>ID</Text>
              <Text style={styles.tableCell}>Name</Text>
              <Text style={styles.tableCell}>Buyer ID</Text>
              <Text style={styles.tableCell}>BuyerName</Text>
              <Text style={styles.tableCell}>Buyer Mobileno</Text>
              <Text style={styles.tableCell}>Date</Text>
            </View>

            {/* Table Rows */}
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#aa336a"
                style={{marginTop: 20}}
              />
            ) : infoData.length > 0 ? (
              infoData.map((item, index) => (
                <View key={item.id} style={styles.tableRow}>
                  {/* <Text style={styles.tableCell}>{index + 1}</Text> */}
                  {/* <Text style={styles.tableCell}>{item.id}</Text> */}
                  <Text style={styles.tableCell}>{item.user_id}</Text>
                  <Text style={styles.tableCell}>{item.user_name}</Text>
                  <Text style={styles.tableCell}>{item.buyer_id}</Text>
                  <Text style={styles.tableCell}>{item.buyer_name}</Text>
                  <Text style={styles.tableCell}>{item.buyer_mobileno}</Text>
                  <Text style={styles.tableCell}>{item.date}</Text>
                </View>
              ))
            ) : (
              <Text style={{textAlign: 'center', marginTop: 20}}>
                No Data Found
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  listHeadLine: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#aa336a',
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tableHeader: {
    backgroundColor: '#ddd',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#333',
  },
  listHeadLineicon: {
    position: 'absolute',
    right: 0,
    top: 20,
  },
});

export default Icecream;
