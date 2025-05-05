import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons"; // Ensure Ionicons is installed
import Datas from "./Datas"; 
import TotalCount from "./TotalCount";
import { AuthContext } from "../AuthContext";
import axios from 'axios';

// Dashboard Component
const Dashboard = () => {
  const {userData, setUserData} = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const [totals, setTotals] = useState({ totalRecords: 0, totalUniqueIds: 0 });
  const [latestEntries, setLatestEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);


  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!userData?.id) return;

      try {
        const response = await axios.get(
          `https://signpostphonebook.in/image_upload_for_new_database.php?id=${userData.id}`,
        );
        // console.log("Fetched Image Response:", response.data);

        if (response.data.success) {
          const imageUrl = response.data.imageUrl;
          const fullUrl = imageUrl.startsWith('http')
            ? imageUrl
            : `https://signpostphonebook.in/${imageUrl}`;
          setProfileImage(fullUrl + `?t=${new Date().getTime()}`); // Prevent caching
          setUserData(prevData => ({...prevData, profileImage: fullUrl}));
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, [userData.id, setUserData]);


  const fetchTotals = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await fetch(
        "https://signpostphonebook.in/client_fetch_for_new_database.php"
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      if (Array.isArray(data)) {
        const totalRecords = data.length;
        const uniqueIds = new Set(data.map((item) => item.id)).size;
        setTotals({ totalRecords, totalUniqueIds: uniqueIds });
        setLatestEntries(data.slice(-10)); // Fetch last 10 entries
        setError(null);
      } else {
        throw new Error("Invalid data structure received");
      }
    } catch (err) {
      console.error("Error fetching totals:", err);
      setError("Failed to load totals.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTotals();
    const interval = setInterval(() => {
      setRefreshing(true);
      fetchTotals();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {refreshing && (
        <View style={styles.refreshingIndicator}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text>Refreshing data...</Text>
        </View>
      )}
      <FlatList
        data={latestEntries}
        ListHeaderComponent={
          <>
            {/* Header Section */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>
                  Hi {userData?.businessname || userData?.person || 'Your Name'}
                </Text>
                {/* <Text style={styles.subGreeting}>
                  Have you taken out the trash today?
                </Text> */}
              </View>
              <Image
                      source={{ uri: profileImage }}
                      style={styles.profileImage}
                      resizeMode="contain"
                    />
            </View>

            {/* Totals Section */}
            <View style={styles.sectionOne}>
              <View style={styles.DivOne}>
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color="#4A90E2"
                />
                <Text style={{ fontSize: 20 }}>
                  Total Records: {totals.totalRecords}
                </Text>
              </View>
              <View style={styles.DivTwo}>
                <Ionicons
                  name="finger-print-outline"
                  size={24}
                  color="#50E3C2"
                />
                <Text style={{ fontSize: 20 }}>
                  Total Unique IDs: {totals.totalUniqueIds}
                </Text>
              </View>
            </View>

            {/* Latest Entries Heading */}
            <Text style={styles.heading}>Last 10 Entries</Text>
          </>
        }
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.entryItem}>
            <Text>ID: {item.id}</Text>
            <Text>Business Name: {item.businessname}</Text>
            <Text>City: {item.city}</Text>
            <Text>Product: {item.product}</Text>
          </View>
        )}
      />
    </View>
  );
};









// Bottom Tabs
const Tab = createBottomTabNavigator();

const AdminPage = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Dashboard") {
            iconName = "view-dashboard";
          } else if (route.name === "Datas") {
            iconName = "database";
          } else if (route.name === "Total Count") {
            iconName = "counter";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Datas"
        component={Datas}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Total Count"
        component={TotalCount}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};




















const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 50,
    height: 150,
    padding: 20,
    backgroundColor: "#EAF0F9",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    flexWrap:"wrap",
  },
  subGreeting: {
    fontSize: 15,
    color: "#888",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#ccc",
  },
  sectionOne: {
    marginBottom: 20,
  },
  DivOne: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  DivTwo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  entryItem: {
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  refreshingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#EAF0F9",
    borderRadius: 5,
  },
});

export default AdminPage;
