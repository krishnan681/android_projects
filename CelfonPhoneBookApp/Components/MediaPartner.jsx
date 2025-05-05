import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "./AuthContext";
import Login from "./Login";

const MediaPartner = () => {
  const {user, Login} = useContext(AuthContext)
  const navigation = useNavigation();

  const components = [
    {
      id: 1,
      name: "Add People",
      image: require("../src/assets/images/addcontact.png"),
      route: "AddPeople",
    },
    {
      id: 2,
      name: "Advt Order Booking",
      image: require("../src/assets/images/adv.png"),
      route: "AdBooking" // Optional: Add this if you create a screen
    },
    {
      id: 3,
      name: "Subscription Booking",
      image: require("../src/assets/images/subscription.png"),
      route: "Subscription",
    },
  ];

  const headerComponent = () => (
    <Text style={styles.listHeadLine}>Media Partner</Text>
  );

 
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        if (user) {
          navigation.navigate(item.route);
        }else{
          Alert.alert("You need to Login to Access this Feature");
          navigation.navigate("Login")
        }
      }}
    >
      <View style={styles.avatarContainer}>
        <Image source={item.image} style={styles.avatar} />
      </View>
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  )
   
return(
  <SafeAreaView>
    
    <FlatList
    ListHeaderComponentStyle={styles.listHeader}
    ListHeaderComponent={headerComponent}
    data={components}
    renderItem={renderItem}
    keyExtractor={(item) => item.id.toString()}
    ItemSeparatorComponent={()=>(
      <View style={styles.separator}/>
    )}
    />
   
    
  </SafeAreaView>
);
};

export default MediaPartner;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listHeader: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  listHeadLine: {
    color: "#333",
    fontSize: 25,
    fontWeight: "bold",
  },
  avatarContainer:{
    backgroundColor:"#ffffff",
    borderRadius:100,
    height:89,
    width:89,
    marginLeft:5,
    justifyContent:'center',
    alignItems:"center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 10,
  },
  avatarContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 100,
    height: 89,
    width: 89,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    height: 55,
    width: 55,
    resizeMode: "contain",
  },
  name: {
    fontWeight: "600",
    fontSize: 20,
    marginLeft: 13,
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#000000",
  },
});
