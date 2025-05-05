import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./Components/AuthContext";
import OnboardingScreen from "./Components/OnboardingScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import "react-native-gesture-handler";
 

// Import Screens
import BottomTabs from "./Components/BottomTabs";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Details from "./Components/Details";
import Profile from "./Components/Profile";
import Coupons from "./Components/Coupons";
import AdminPage from "./Components/Admin/AdminPage";
import UserGuide from "./Components/UserGuide";
import Favorites from "./Components/Favorites";
import { SafeAreaView, View } from "react-native";
import CncComponent from "./Components/ProductsComponents/CncComponent";
import Automation from "./Components/ProductsComponents/Automation";
import Foundary from "./Components/ProductsComponents/Foundary";
import Machinery from "./Components/ProductsComponents/Machinery";
import SearchModal from "./Components/SearchModal";
import ListScreen from "./Components/ListScreen";
import Subscription from "./Components/MediaPartner/Subscription";
import AddPeople from "./Components/MediaPartner/AddPeople";
import NearbyPromotion from "./Components/NearbyPromotion"
import CategoryWisePromotion from "./Components/CategorywisePromotion"
import FeautredSearch from "./Components/FeautredSearch"
import Fabrication from "./Components/ProductsComponents/Fabrications"
import Textiles from "./Components/ProductsComponents/Textiles"
import AddvertisementBooking from "./Components/AddvertisementBooking";
import AlphabeticalList from "./Components/AlphabeticalList";
import Account from "./Components/Account";
import OurPanels from "./Components/OurPanels";
import Icecream from "./Components/Icecream";
import BuyerInformation from "./Components/BuyerInformation";
import ShopOwnerInformation from "./Components/ShopOwnerInformation";
import IceCreamTransaction from "./Components/IceCreamTransaction";
 



const Stack = createStackNavigator();
 
const App = () => {

  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem("isFirstLaunch");
        if (value === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem("isFirstLaunch", "false"); // Set flag
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error("AsyncStorage error:", error);
      }
    };
    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null; // Prevent rendering until check is complete
  }

  return (
    
    <AuthProvider >
    <NavigationContainer>
      <Stack.Navigator>
        {isFirstLaunch && (
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen}  options={{ headerShown: false }} />
        )}
        <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={Details} options={{ headerShown: true }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="Coupons" component={Coupons} options={{ headerShown: true }} />
        <Stack.Screen name="AdminPage" component={AdminPage} options={{ headerShown: true }} />
        <Stack.Screen name="UserGuide" component={UserGuide} options={{ headerShown: true }} />
        <Stack.Screen name="Mylist" component={Favorites} options={{ headerShown: true }} />
        <Stack.Screen name="CNC" component={CncComponent} options={{ headerShown: true }} />
        <Stack.Screen name="Automation" component={Automation} options={{ headerShown: true }} />
        <Stack.Screen name="Foundary" component={Foundary} options={{ headerShown: true }} />
        <Stack.Screen name="Machinery" component={Machinery} options={{ headerShown: true }} />
        <Stack.Screen name="SearchMore" component={SearchModal} options={{headerShown:false}} />
        <Stack.Screen name="ListScreen" component={ListScreen} />
        <Stack.Screen name="AddPeople" component={AddPeople} options={{headerShown:true}} />
        <Stack.Screen name="NearByPromotion" component={NearbyPromotion} options={{headerShown:true}} />
        <Stack.Screen name="CategoryWisePromotion" component={CategoryWisePromotion} options={{headerShown:true}} />
        <Stack.Screen name="FeauturedSearch" component={FeautredSearch} options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="Subscription" component={Subscription} options={{headerShown:false}}/>
        <Stack.Screen name="Fabrication" component={Fabrication} />
        <Stack.Screen name="Textiles" component={Textiles} />
        <Stack.Screen name="AdBooking" component={AddvertisementBooking} options={{headerShown:false}} />
        <Stack.Screen name="Favorites" component={Favorites}  />
        <Stack.Screen name="AlphabeticalList" component={AlphabeticalList} options={{headerShown:false}} />
        <Stack.Screen name="Account" component={Account} options={{headerShown:false}} />
        <Stack.Screen name="OurPanels" component={OurPanels} options={{headerShown:false}} />
        <Stack.Screen name="Icecream" component={Icecream}  options={{headerShown:false}}/>
        <Stack.Screen name="BuyerInformation" component={BuyerInformation}  options={{headerShown:false}}/>
        <Stack.Screen name="ShopOwnerInformation" component={ShopOwnerInformation}  options={{headerShown:false}}/>
        <Stack.Screen name="IceCreamTransaction" component={IceCreamTransaction}  options={{headerShown:false}}/>
         

      </Stack.Navigator>
    </NavigationContainer>
  </AuthProvider>
  );
};

export default App;
