// import React, { useContext, useState } from 'react';
// import { Modal, View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
// import { useFavorites } from '../Context/FavoriteContext';
// import { AuthContext } from './AuthContext';
// import Icon from 'react-native-vector-icons/FontAwesome';

// export default function Favorites() {
//   const [visible, setVisible] = useState(false);
//   const {
//     favoriteGroups,
//     deleteGroup,
//     deleteMember,
//     addGroup,
//     editGroup,
    
//   } = useFavorites();

//   const {userData}= useContext(AuthContext);

//   return (
//     <ScrollView>
//       <TouchableOpacity style={styles.iconContainer} onPress={()=> setVisible(true)}>
//         <Icon name="plus" size={20} color="#fff"/>
//      </TouchableOpacity>

//      <Modal
//         animationType="slide"
//         transparent={true}
//         visible={visible}
//         onRequestClose={() => setVisible(false)}
//       >
//         <View style={styles.modalBackground}>
//           <View style={styles.modalBox}>
//             <Text style={styles.modalText}>Enter a Group Name</Text>
//             <TextInput placeholder='Enter a name' style={styles.input}/>
//             <Button title="Close" onPress={() => setVisible(false)} />
//           </View>
//         </View>
//       </Modal>
//       {favoriteGroups.map(group => (
//         <View key={group.id} style={{ padding: 10, borderBottomWidth: 1 }}>
//           <Text style={{ fontWeight: 'bold' }}>{group.name}</Text>
//           <Button title="Edit Group" onPress={() => {
//             Alert.prompt('Edit Group Name', '', newName => editGroup(group.id, newName));
//           }} />
//           <Button title="Delete Group" onPress={() => deleteGroup(group.id)} />

//           {group.members.map(member => (
//             <View key={member.id} style={{ marginLeft: 10 }}>
//               <Text>- {member.name} ({member.mobileno})</Text>
              
//               <Button title="Delete" onPress={() => deleteMember(member.id)} />
//             </View>
//           ))}
//         </View>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//    iconContainer: {
//     backgroundColor: '#007BFF', // Blue background
//     borderRadius: 25,           // Half of width/height for circle
//     width: 30,
//     height: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalBackground: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalBox: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     elevation: 10,
//   },
//   modalText: {
//     fontSize: 18,
//     marginBottom: 15,
//     textAlign: 'center',
//   },
// })
import React, { useContext, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFavorites } from '../Context/FavoriteContext';
import { AuthContext } from './AuthContext';

export default function Favorites() {
  const [visible, setVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const { favoriteGroups, deleteGroup, deleteMember, addGroup, editGroup } = useFavorites();
  const { userData } = useContext(AuthContext);

  const handleAddGroup = () => {
    if (newGroupName.trim() !== '') {
      addGroup(newGroupName, userData.id);
      setNewGroupName('');
      setVisible(false);
    } else {
      Alert.alert("Error", "Group name cannot be empty.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setVisible(true)}>
        <Icon name="plus" size={20} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Enter a Group Name</Text>
            <TextInput
              placeholder='Enter a name'
              style={styles.input}
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddGroup}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setVisible(false)}>
                <Text style={styles.btnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {favoriteGroups.map(group => (
        <View key={group.id} style={styles.groupContainer}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupTitle}>{group.name}</Text>
            <View style={styles.groupActions}>
              
              <TouchableOpacity onPress={() =>
                Alert.prompt('Edit Group Name', '', newName => editGroup(group.id, newName))
              }>
                <Icon name="edit" size={20} color="#007BFF" style={styles.iconMargin} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteGroup(group.id)}>
                <Icon name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>

          {group.members.map(member => (
            <View key={member.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberPhone}>
                  <Icon name="phone" size={14} /> {member.mobileno}
                </Text>
              </View>
              <View style={styles.cardRight}>
                {/* <TouchableOpacity onPress={() => Implement edit logic}> */}
                  {/* <Icon name="edit" size={18} color="#007BFF" style={styles.iconMargin} />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => deleteMember(member.id)}>
                  <Icon name="trash" size={18} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 12,
    alignSelf: 'flex-end',
    marginBottom: 16,
    elevation: 4,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  groupContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  groupActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconMargin: {
    marginRight: 16,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardLeft: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  memberPhone: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
});
