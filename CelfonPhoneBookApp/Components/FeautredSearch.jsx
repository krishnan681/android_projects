import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const sampleKeywords = [
  'Electronics',
  'Groceries',
  'Pharmacy',
  'Clothing',
  'Bakery',
  'Automobile',
  'Stationery',
  'Furniture',
  'Mobile',
];

const FeautredSearch = () => {
  const navigation = useNavigation();
  const [firmName, setFirmName] = useState('');
  const [productName, setProductName] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [lastFocusedInput, setLastFocusedInput] = useState('product'); // or "firm"

  const handleSearch = () => {
    const newSearch = {
      firmName: firmName.trim(),
      productName: productName.trim(),
    };

    // Avoid duplicates in recent searches
    const isDuplicate = recentSearches.some(
      item =>
        item.firmName === newSearch.firmName &&
        item.productName === newSearch.productName,
    );
    if (!isDuplicate && (newSearch.firmName || newSearch.productName)) {
      setRecentSearches([newSearch, ...recentSearches.slice(0, 4)]); // Max 5 items
    }

    navigation.navigate('ListScreen', newSearch);
  };

  const handleKeywordClick = keyword => {
    if (lastFocusedInput === 'firm') {
      setFirmName(keyword);
    } else {
      setProductName(keyword);
    }
  };

  const handleRecentSearchClick = search => {
    setFirmName(search.firmName);
    setProductName(search.productName);
  };

  const handleDeleteRecent = indexToDelete => {
    setRecentSearches(prev =>
      prev.filter((_, index) => index !== indexToDelete),
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Search</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

   {/* Firm Name Input */}
<View style={styles.inputWrapper}>
  <TextInput
    placeholder="Search Firms/Businesses"
    value={firmName}
    onChangeText={setFirmName}
    onTouchStart={() => {
      if (productName) setProductName('');
      setLastFocusedInput('firm');
    }}
    style={styles.input}
  />
  {firmName.length > 0 && (
    <TouchableOpacity
      style={styles.clearIcon}
      onPress={() => setFirmName('')}>
      <Text style={{fontSize: 10}}>✕</Text>
    </TouchableOpacity>
  )}
</View>

{/* Product Name Input */}
<View style={styles.inputWrapper}>
  <TextInput
    placeholder="Search Products"
    value={productName}
    onChangeText={setProductName}
    onTouchStart={() => {
      if (firmName) setFirmName('');
      setLastFocusedInput('product');
    }}
    style={styles.input}
  />
  {productName.length > 0 && (
    <TouchableOpacity
      style={styles.clearIcon}
      onPress={() => setProductName('')}>
      <Text style={{fontSize: 10}}>✕</Text>
    </TouchableOpacity>
  )}
</View>


      {/* Suggested Keywords */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Suggested Keywords</Text>
        <View style={styles.keywordContainer}>
          {sampleKeywords.map((keyword, index) => (
            <TouchableOpacity
              key={index}
              style={styles.keywordTag}
              onPress={() => handleKeywordClick(keyword)}>
              <Text style={styles.keywordText}>{keyword}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={{fontSize: 16, fontWeight: '600', marginBottom: 8}}>
        Recent Searchs
      </Text>

      {/* Recent Searches */}
      {recentSearches.map((item, index) => (
        <View key={index} style={styles.recentItemRow}>
          <TouchableOpacity
            style={styles.recentItem}
            onPress={() => handleRecentSearchClick(item)}>
            <Text>
              {item.firmName || '—'} {item.productName || '—'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleDeleteRecent(index)}>
            <Text style={styles.deleteIcon}>x</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
        <Text style={styles.searchBtnText}>Search</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {fontSize: 20, fontWeight: 'bold'},
  closeIcon: {fontSize: 22},
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  searchBtn: {
    backgroundColor: '#1aa0dc',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  searchBtnText: {color: '#fff', fontWeight: 'bold'},
  section: {marginTop: 16},
  subHeader: {fontSize: 16, fontWeight: '600', marginBottom: 8},
  keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordTag: {
    backgroundColor: '#e0f7ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  keywordText: {color: '#0079a3', fontWeight: '500'},
  recentItem: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 8,
  },
  recentItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  deleteIcon: {
    fontSize: 18,
    color: 'red',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  clearIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    right: 10,
    top: 19,
    zIndex: 1,
  },
});

export default FeautredSearch;
