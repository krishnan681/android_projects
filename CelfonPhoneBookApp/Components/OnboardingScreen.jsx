import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';

const {width} = Dimensions.get('window');

const OnboardingScreen = ({navigation}) => {
   
  const handleDone = () => {
    navigation.replace('BottomTabs');  
  };
  

  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        pages={[

          // Onboarding Screens page 1
          {
            backgroundColor: '#FFEDFA',
            image: (
              <View style={styles.lottieContainer}>
                <LottieView
                  source={require('../src/assets/animations/OnBoarding Animations/Animation - 1741766420544.json')} // Ensure correct path
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: 'Welcome!',
            subtitle: 'Find Mobile Number & Dial!',
          },


          // Onboarding Screens page 2

          {
            backgroundColor: '#FFB8E0',
            image: (
              <View style={styles.lottieContainer}>
                <LottieView
                  source={require('../src/assets/animations/OnBoarding Animations/Animation - 1743054865609.json')} // Ensure correct path
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: 'DataBase of Millions of Mobile Users Pan India!',
            // subtitle: 'Navigate through the app effortlessly!',
          },
          
          // Onboarding Screens page 3

          {
            backgroundColor: '#EC7FA9',
            image: (
              <View style={styles.lottieContainer}>
                <LottieView
                  source={require('../src/assets/animations/OnBoarding Animations/Animation - 1741767350475.json')} // Ensure correct path

                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: 'Business Promotion to nearby Areas (for B2C, D2C)',
            // subtitle: 'Start using the app now!',
          },
          
          // Onboarding Screens page 4

          {
            backgroundColor: '#BE5985',
            image: (
              <View style={styles.lottieContainer}>
                <LottieView
                  source={require('../src/assets/animations/OnBoarding Animations/Animation - 1741773493053.json')} // Ensure correct path

                  // source={require('../src/assets/animations/OnBoarding Animations/Animation - 1741773493053.json')} // Ensure correct path
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: 'Category wise Promotion in entire city (for B2B)',
            // subtitle: 'Start using the app now!',
          },

          
          // Onboarding Screens page 5

          {
            backgroundColor: 'white',
            image: (
              <View style={styles.lottieContainer}>
                <LottieView
                  source={require('../src/assets/animations/OnBoarding Animations/Animation - 1743057436288.json')} // Ensure correct path
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: 'to Signpostphonebook!',
            subtitle: 'Dive into the experience today!',
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  lottieContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: width * 0.8,
    height: width * 0.8,
  },
});

export default OnboardingScreen;
