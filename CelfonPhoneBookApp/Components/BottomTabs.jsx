// import React, { useContext } from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { StyleSheet } from "react-native";
// import { AuthContext } from "./AuthContext";
// import { Alert } from "react-native";

// // Import Screens
// import Home from "./Home";
// import Settings from "./Settings";
// import CategorywisePromotion from "./CategorywisePromotion";
// import NearbyPromotion from "./NearbyPromotion";
// import MediaPartner from "./MediaPartner";
// import Login from "./Login"; // Import Login screen
// import Landingpage from "./Landingpage";

// const Tab = createBottomTabNavigator();

// const BottomTabs = ({ navigation }) => {
//   const { user } = useContext(AuthContext);

//   // Function to handle restricted navigation
//   const handleRestrictedNavigation = (navigation, screenName) => {
//     if (!user) {
//       Alert.alert("Restricted Access", "You need to log in.");
//       navigation.navigate("Login"); // Redirect to Login screen
//       return;
//     }
//     navigation.navigate(screenName); // Navigate to the requested screen
//   };

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName;
//           switch (route.name) {
//             case "Celfon5G+ PHONE BOOK":
//               iconName = "home";
//               break;

//             case "MediaPartner":
//               iconName = "users";
//               break;

//             case "Search":
//               iconName = "search";
//               break;

//             case "CategorywisePromotion":
//                 iconName = "crown";
//                 break;

//             case "Settings":
//               iconName = "cog";
//               break;
//             default:
//               iconName = "question-circle";
//           }
//           return <FontAwesome name={iconName} size={30} color={color} />;
//         },
//         tabBarActiveTintColor: "#aa336a",
//         tabBarInactiveTintColor: "#000",
//         tabBarStyle: styles.tabBarStyle,
//       })}
//     >
//       <Tab.Screen name="Celfon5G+ PHONE BOOK" component={Landingpage} options={{ headerShown: false }} />

// {/* <Tab.Screen
//         name="MediaPartner"
//         component={user ? MediaPartner : Login}
//         options={{ headerShown: false }}
//         listeners={({ navigation }) => ({
//           tabPress: (e) => {
//             if (!user) {
//               e.preventDefault();
//               handleRestrictedNavigation(navigation, "MediaPartner");
//             }
//           },
//         })}

//       /> */}

//       <Tab.Screen name="MediaPartner" component={MediaPartner} options={{headerShown:false}}/>

//       <Tab.Screen
//         name="Search"
//         component={user ? NearbyPromotion : Login}
//         options={{ headerShown: false }}
//         listeners={({ navigation }) => ({
//           tabPress: (e) => {
//             if (!user) {
//               e.preventDefault();
//               handleRestrictedNavigation(navigation, "NearbyPromotion");
//             }
//           },
//         })}

//       />

// <Tab.Screen
//         name="CategorywisePromotion"
//         component={user ? CategorywisePromotion : Login}
//         options={{ headerShown: false }}
//         listeners={({ navigation }) => ({
//           tabPress: (e) => {
//             if (!user) {
//               e.preventDefault();
//               handleRestrictedNavigation(navigation, "CategorywisePromotion");
//             }
//           },
//         })}

//       />

//       <Tab.Screen name="Settings" component={Settings} options={{ headerShown: true }} />
//     </Tab.Navigator>
//   );
// };

// const styles = StyleSheet.create({
//   tabBarStyle: {
//     position: "relative",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     height: 60,
//   },
// });

// export default BottomTabs;

import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {StyleSheet, TouchableOpacity, View, Text, Platform} from 'react-native';
import {AuthContext} from './AuthContext';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Screens
import Home from './Home';
import Settings from './Settings';
import MediaPartner from './MediaPartner';
import Landingpage from './Landingpage';
import Promotions from './Promotions';

const Tab = createBottomTabNavigator();

const BottomTabs = ({navigation}) => {
  const {user} = useContext(AuthContext);

  const handleRestrictedNavigation = (navigation, screenName) => {
    if (!user) {
      Alert.alert('Restricted Access', 'You need to log in.');
      navigation.navigate('Login');
      return;
    }
    navigation.navigate(screenName);
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'MediaPartner':
              iconName = 'users';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Promotions':
              iconName = 'comment';
              break;
            case 'Settings':
              iconName = 'cog';
              break;
            default:
              iconName = 'question-circle';
          }
          return <FontAwesome name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#aa336a',
        tabBarInactiveTintColor: '#000',
        tabBarStyle: styles.tabBarStyle,
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={Landingpage} />

      {/* <Tab.Screen
        name="MediaPartner"
        component={user ? NearbyPromotion : Login}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              handleRestrictedNavigation(navigation, "NearbyPromotion");
            }
          },
        })}
      /> */}

      <Tab.Screen
        name="MediaPartner"
        component={MediaPartner}
        options={{headerShown: false}}
      />

      <Tab.Screen
        name="Search"
        component={Home}
        options={{
          tabBarButton: () => {
            const navigation = useNavigation();

            return (
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => navigation.navigate('SearchMore')}>
                <FontAwesome name="search" size={24} color="#fff" />
              </TouchableOpacity>
            );
          },
        }}
      />

      <Tab.Screen name="Promotions" component={Promotions} />

      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    borderTopWidth: 0,
  },
  floatingButton: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: '#ff0000',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default BottomTabs;
