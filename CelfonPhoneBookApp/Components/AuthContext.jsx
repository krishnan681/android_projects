import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState("");
  //Persist user data in localStorage
useEffect(()=>{
  const loadUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const storedUserData = await AsyncStorage.getItem("userData");

      if (storedUser && storedUserData) {
        setUser(JSON.parse(storedUser));
        setUserData(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error("Failed to load from AsyncStorage", error);
    }
  };

  loadUserFromStorage();
},[])

  // Login Function
  const Login = async (username, password, navigation) => {
    if (!username) {
      Alert.alert("Error", "Please enter your registered mobile number.");
      return;
    }

    if (password !== "signpost") {
      Alert.alert("Invalid Password", "Please enter the correct password.");
      return;
    }

    try {
      const response = await axios.post(
        "https://signpostphonebook.in/test_auth_for_new_database.php",
        { mobileno: username }
      );

      if (response.data.valid) {
        setUser(response.data.businessname || response.data.person);
        setUserData(response.data);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.businessname || response.data.person));      
        await AsyncStorage.setItem("userData", JSON.stringify(response.data));
        navigation.navigate("Home");
      } else {
        Alert.alert("User Not Found", "Please sign up.");
        navigation.navigate("Signup");
      }
    } catch (error) {
      Alert.alert("Login Error", "Unable to login. Please try again later.");
      console.error("Login Error:", error);
    }
  };

  // Logout Function
  const logout = async (navigation) => {
    setUser("");
    setUserData("");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("userData");
    navigation.navigate("Login");
  };

  return (
    <AuthContext.Provider value={{ user, userData, setUserData, Login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
