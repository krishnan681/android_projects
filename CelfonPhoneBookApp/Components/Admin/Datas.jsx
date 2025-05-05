import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Card, Text, Button, TextInput, FAB} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const Datas = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({
    businessname: '',
    city: '',
    product: '',
    mobileno: '',
    email: '',
    pincode: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://signpostphonebook.in/client_fetch_for_new_database.php',
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();

      if (Array.isArray(result)) {
        setData(result);
        setFilteredData(result);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch data');
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
    const filtered = query.trim()
      ? data.filter(
          item =>
            item.businessname.toLowerCase().includes(query.toLowerCase()) ||
            item.city.toLowerCase().includes(query.toLowerCase()) ||
            item.product.toLowerCase().includes(query.toLowerCase()),
        )
      : data;
    setFilteredData(filtered);
  };

  const openModal = (item = null) => {
    if (item) {
      setSelectedItem(item);
    } else {
      setNewItem({
        businessname: '',
        city: '',
        product: '',
        mobileno: '',
        email: '',
        pincode: '',
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  const handleSave = async () => {
    const url = selectedItem
      ? 'https://signpostphonebook.in/update_row_for_new_database.php'
      : 'https://signpostphonebook.in/create_row.php';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(selectedItem || newItem),
      });

      if (response.ok) {
        fetchData();
        Alert.alert('Success', selectedItem ? 'Item updated' : 'Item added');
      } else {
        Alert.alert('Error', 'Failed to save data');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to save data');
    }
    closeModal();
  };

  const confirmDelete = id => {
    Alert.alert('Confirm Delete', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: () => handleDelete(id)},
    ]);
  };

  const handleDelete = async id => {
    try {
      const response = await fetch(
        'https://signpostphonebook.in/delete_row_for_new_database.php',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id}),
        },
      );

      if (response.ok) {
        setData(prev => prev.filter(item => item.id !== id));
        setFilteredData(prev => prev.filter(item => item.id !== id));
        Alert.alert('Success', 'Item deleted');
      } else {
        Alert.alert('Error', 'Failed to delete item');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        mode="outlined"
        label="Search"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
        left={<TextInput.Icon icon="magnify" />}
      />

      {/* Refresh Button */}
      <Button
        icon="refresh"
        mode="contained"
        onPress={fetchData}
        style={styles.refreshButton}>
        Refresh Data
      </Button>

      {/* Data List */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No data found</Text>}
        renderItem={({item}) => (
          <Card style={styles.card}>
            <Card.Title title={item.businessname} subtitle={item.city} />
            <Card.Content>
              <Text>Product: {item.product}</Text>
              <Text>Mobile: {item.mobileno}</Text>
              <Text>Email: {item.email}</Text>
              <Text>Pincode: {item.pincode}</Text>
            </Card.Content>
            <Card.Actions>
              <Button icon="pencil" onPress={() => openModal(item)}>
                Edit
              </Button>
              <Button
                icon="trash-can"
                color="red"
                onPress={() => confirmDelete(item.id)}>
                Delete
              </Button>
            </Card.Actions>
          </Card>
        )}
      />

      {/* Floating Action Button (FAB) */}
      {/* <FAB style={styles.fab} icon="plus" onPress={() => openModal()} /> */}

      {/* Modal for Add/Edit */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedItem ? 'Edit Entry' : 'Add Entry'}
            </Text>

            {/* Prefix */}


            <TextInput
              mode="outlined"
              label="Prefix"
              value={selectedItem ? selectedItem.prefix : newItem.prefix}
              onChangeText={text =>
                selectedItem
                  ? setSelectedItem({...selectedItem, prefix: text})
                  : setNewItem({...newItem, prefix: text})
              }
              style={styles.input}
            />

            {/* bussiness name */}

            <TextInput
              mode="outlined"
              label="Business Name"
              value={
                selectedItem ? selectedItem.businessname : newItem.businessname
              }
              onChangeText={text =>
                selectedItem
                  ? setSelectedItem({...selectedItem, businessname: text})
                  : setNewItem({...newItem, businessname: text})
              }
              style={styles.input}
            />

            {/* Address */}


            <TextInput
              mode="outlined"
              label="Address"
              value={selectedItem ? selectedItem.address : newItem.address}
              onChangeText={text =>
                selectedItem
                  ? setSelectedItem({...selectedItem, address: text})
                  : setNewItem({...newItem, address: text})
              }
              style={styles.input}
            />

            {/* City */}


            <TextInput
              mode="outlined"
              label="City"
              value={selectedItem ? selectedItem.city : newItem.city}
              onChangeText={text =>
                selectedItem
                  ? setSelectedItem({...selectedItem, city: text})
                  : setNewItem({...newItem, city: text})
              }
              style={styles.input}
            />

            {/* Pincode */}

            <TextInput
              mode="outlined"
              label="Pincode"
              value={selectedItem ? selectedItem.pincode : newItem.pincode}
              onChangeText={text =>
                selectedItem
                  ? setSelectedItem({...selectedItem, pincode: text})
                  : setNewItem({...newItem, pincode: text})
              }
              style={styles.input}
              keyboardType="numeric"
            />

            {/* email */}


            <TextInput
              mode="outlined"
              label="Email"
              value={selectedItem ? selectedItem.email : newItem.email}
              onChangeText={text =>
                selectedItem
                  ? setSelectedItem({...selectedItem, email: text})
                  : setNewItem({...newItem, email: text})
              }
              style={styles.input}
              keyboardType="email-address"
            />

            {/* product */}


            <TextInput
              mode="outlined"
              label="Product"
              value={selectedItem ? selectedItem.product : newItem.product}
              onChangeText={text =>
                selectedItem
                  ? setSelectedItem({...selectedItem, product: text})
                  : setNewItem({...newItem, product: text})
              }
              style={styles.input}
              keyboardType="product"
            />

            <View style={styles.modalButtons}>
              <Button mode="contained" onPress={handleSave}>
                Save
              </Button>
              <Button mode="outlined" onPress={closeModal}>
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#f5f5f5'},
  searchInput: {marginBottom: 10},
  refreshButton: {marginBottom: 10},
  card: {marginBottom: 10},
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200ea',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  input: {marginBottom: 10},
  modalButtons: {flexDirection: 'row', justifyContent: 'space-between'},
});

export default Datas;
