import React, { createContext, useState } from "react";
import axios from "axios";
import { Alert } from "react-native";

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState("");

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
  const logout = (navigation) => {
    setUser("");
    setUserData("");
    navigation.navigate("Login");
  };

  return (
    <AuthContext.Provider value={{ user, userData, setUserData, Login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
