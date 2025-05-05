import { StyleSheet, Text, View, SafeAreaView, FlatList, Image, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";


export default function Promotions ({navigation}){

  const {user}= useContext(AuthContext)
  const components = [
    {
      id:1,
      name : "Nearby Promotions",
      image: require("../src/assets/images/promon.jpg"), 
      route:"NearByPromotion"
    },
    {
      id:2,
      name : "Categorywise Promotion",
      image: require("../src/assets/images/promoc.jpg"),
      route:"CategoryWisePromotion"
    },
    {
      id:3,
      name : "Favourites",
      image: require("../src/assets/images/fav.jpg"),
      route:"Favorites"
    },
    {
      id:4,
      name : "OurPanels",
      image: require("../src/assets/images/billboard.png"),
      route:"OurPanels"
    },
  ] 

  const headerComponent =()=>{
    return <Text style={styles.listHeadLine}>Promotion's</Text>
  }

  

  const renderItem = ({item})=>(
    <TouchableOpacity style={styles.item} onPress={()=>{
      if(user){
        navigation.navigate(item.route)
      }else{
        Alert.alert("You Need to Login to Access this Feature")
        navigation.navigate("Login")
      }
    }}>
      <View style={styles.avatarContainer}>
        <Image source={item.image} style={styles.avatar}/>
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

}

const styles = StyleSheet.create({
  listHeader:{
    height:55,
    justifyContent:"center",
    alignItems:"center"
  },
  listHeadLine:{
    color:"#333",
    fontSize:25,
    fontWeight:"bold"
  },
  item:{
    flex:1,
    flexDirection:"row",
    alignItems:"center",
    paddingVertical:13,
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
  avatar:{
    height:55,
    width:55
  },
  name:{
    fontWeight:'600',
    fontSize:20,
    marginLeft:13,
  },
  separator:{
    height:1,
    width:"100%",
    backgroundColor:"#000000"
  },
})