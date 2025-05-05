import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';

const Skeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View>
      {[...Array(10)].map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <View style={styles.skeletonText}>
            <Animated.View style={[styles.shimmerEffect, {opacity}]} />
          </View>
          <View style={styles.skeletonSubText}>
            <Animated.View style={[styles.shimmerEffect, {opacity}]} />
          </View>
          <View style={styles.skeletonButtonContainer}>
            <View style={styles.skeletonButton}>
              <Animated.View style={[styles.shimmerEffect, {opacity}]} />
            </View>
            <View style={styles.skeletonButton}>
              <Animated.View style={[styles.shimmerEffect, {opacity}]} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 10,
    margin: 10,
    opacity: 0.7,
    overflow: 'hidden',
  },
  skeletonText: {
    width: '80%',
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  skeletonSubText: {
    width: '60%',
    height: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  skeletonButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonButton: {
    width: '45%',
    height: 35,
    backgroundColor: '#D0D0D0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  shimmerEffect: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    opacity: 0.3,
  },
});

export default Skeleton;
