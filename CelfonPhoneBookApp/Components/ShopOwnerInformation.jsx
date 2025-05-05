import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const ShopOwnerInformation = () => {
  const [shopOwnerId, setShopOwnerId] = useState('');
  const [shopOwnerName, setShopOwnerName] = useState('');
  const [totalIceCream, setTotalIceCream] = useState('');
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://signpostphonebook.in/client_fetch_for_new_database.php',
        );
        const jsonResponse = await response.json();
        if (Array.isArray(jsonResponse)) {
          const sortedData = jsonResponse.sort((a, b) => b.id - a.id);
          setCompanies(sortedData);
        } else {
          Alert.alert('Error', 'Unexpected response from server.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load data: ' + error.message);
      }
    };
    fetchData();
  }, []);

  const handleLookup = () => {
    const found = companies.find(item => item.id === shopOwnerId);
    if (found) {
      setShopOwnerName(found.businessname || found.person || '');
    } else {
      Alert.alert('Not found', 'No matching ID found.');
      setShopOwnerName('');
    }
  };

  const handleSubmit = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const payload = {
      shop_owner_id: shopOwnerId,
      shop_owner_name: shopOwnerName,
      total_ice_cream: parseInt(totalIceCream) || 0,
      sold_ice_cream: 0, // default to 0
      date: formattedDate, // auto-set current date
    };

    try {
      const response = await fetch(
        'https://signpostphonebook.in/icecream/owner_information.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (result.success) {
        Alert.alert('Success', result.message);
        // Reset inputs
        setShopOwnerId('');
        setShopOwnerName('');
        setTotalIceCream('');
      } else {
        if (result.message.toLowerCase().includes('duplicate')) {
          Alert.alert('Duplicate Entry', 'Shop Owner ID already exists.');
        } else {
          Alert.alert('Error', result.message);
        }
      }
    } catch (error) {
      Alert.alert('Network Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Shop Owner ID</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, {flex: 1}]}
          value={shopOwnerId}
          onChangeText={setShopOwnerId}
          placeholder="Enter shop owner ID"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.plusButton} onPress={handleLookup}>
          <Text style={styles.plusText}>＋</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Shop Owner Name</Text>
      <TextInput
        style={styles.input}
        value={shopOwnerName}
        placeholder="Fetched name"
        editable={false}
      />

      <Text style={styles.label}>Total Ice Cream</Text>
      <TextInput
        style={styles.input}
        value={totalIceCream}
        onChangeText={setTotalIceCream}
        placeholder="Enter total ice cream"
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleSubmit} color="#D5006D" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f7f7', // Light background for better contrast
    flexGrow: 1,
  },
  label: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600', // Slightly lighter weight for better readability
    color: '#333', // Dark color for the label to ensure contrast
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000', // Subtle shadow to create depth
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContainer: {
    marginTop: 30,
    borderRadius: 8,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  plusButton: {
    backgroundColor: '#D5006D', // Dark pink color
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default ShopOwnerInformation;
