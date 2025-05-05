import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const userPoints = 500; // User's available points

const coupons = [
  {
    id: "1",
    brand: "Adidas",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Adidas_logo.png",
    discount: "50% OFF",
    cost: 200,
    expires: "30 Jul 2019",
  },
  {
    id: "2",
    brand: "Nike",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    discount: "50% OFF",
    cost: 500,
    expires: "04 Aug 2019",
  },
  {
    id: "3",
    brand: "Zara",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Zara_Logo.svg",
    discount: "50% OFF",
    cost: 1000,
    expires: "30 Apr 2019",
  },
  {
    id: "4",
    brand: "Uniqlo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Adidas_logo.png",
    discount: "50% OFF",
    cost: 1500,
    expires: "30 Apr 2019",
  },
];

const Coupons = () => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FF69B4', '#FFFFFF']} style={styles.header}>
        <Text style={styles.points}>{userPoints}</Text>
        <Text style={styles.subText}>Total points</Text>
      </LinearGradient>




      

      <FlatList
        data={coupons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const canRedeem = userPoints >= item.cost; // Check if user has enough points
          return (
            <View style={[styles.couponContainer, !canRedeem && styles.dimmed]}>
              <View style={styles.leftRibbon}>
                <Text style={styles.ribbonText}>DISCOUNT</Text>
              </View>
              <View style={styles.couponContent}>
                <Image source={{ uri: item.logo }} style={styles.logo} />
                <Text style={styles.couponText}>
                  {item.brand}'s gift value packed {item.discount}
                </Text>
                <Text style={styles.cost}>Cost {item.cost} POINTS</Text>
                <Text style={styles.expiry}>Expires {item.expires}</Text>
                <TouchableOpacity
                  style={[styles.redeemButton, !canRedeem && styles.disabledButton]}
                  disabled={!canRedeem}
                >
                  <Text style={styles.redeemText}>{canRedeem ? "Redeem" : "Not Enough Points"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  points: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  subText: {
    fontSize: 16,
    color: "#fff",
  },
  couponContainer: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 10,
    flexDirection: "row",
    elevation: 3,
  },
  dimmed: {
    opacity: 0.5, // Makes the unavailable coupons look faded
  },
  leftRibbon: {
    backgroundColor: '#FF69B4',
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  ribbonText: {
    color: "white",
    transform: [{ rotate: "-90deg" }],
    fontWeight: "bold",
  },
  couponContent: {
    flex: 1,
    padding: 15,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  couponText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  cost: {
    color: "#1976D2",
    fontWeight: "bold",
  },
  expiry: {
    color: "gray",
    fontSize: 12,
    marginVertical: 5,
  },
  redeemButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  disabledButton: {
    backgroundColor: "#ccc", // Gray out the button if user doesn't have enough points
  },
  redeemText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Coupons;
