import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const normalPageCarouselItems = [
  {id: 1, image: require('../src/assets/images/FirstImage.jpg')},
  {id: 2, image: require('../src/assets/images/SecondImage.jpg')},
  {id: 3, image: require('../src/assets/images/ThirdImage.jpg')},
];

const fullPageCarouselItems = [
  {id: 1, image: require('../src/assets/images/Fullimageone.jpg')},
  {id: 2, image: require('../src/assets/images/Fullimagetwo.jpg')},
  {id: 3, image: require('../src/assets/images/Fullimagethree.jpg')},
];

const smallPageCarouselItems = [
  {id: 1, image: require('../src/assets/images/smallimageone.jpg')},
  {id: 2, image: require('../src/assets/images/smallimagetwo.jpg')},
  {id: 3, image: require('../src/assets/images/smallimagethree.jpg')},
];

const OurPanels = () => {
  return (
    <ScrollView
 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}>
      <LinearGradient
        colors={['#1c2331', '#1f2940']}
        style={styles.gradientBackground}>
        {/* normalPageCarouselItems */}

        <View style={styles.wrapper}>
          <Text style={styles.heading}>Our Panels</Text>
          <View style={styles.carouselWrapper}>
            <Carousel
              loop
              width={width * 0.9}
              height={250}
              autoPlay
              data={normalPageCarouselItems}
              scrollAnimationDuration={1000}
              renderItem={({item}) => (
                <Image
                  source={item.image}
                  style={styles.normalImage}
                  resizeMode="contain"
                />
              )}
            />
          </View>
        </View>

        {/* fullPageCarouselItems */}

        <View style={styles.wrapper}>
          <Text style={styles.heading}>Featured Banners</Text>
          <View style={styles.carouselWrapper}>
            <Carousel
              loop
              width={width}
              height={420}
              autoPlay
              data={fullPageCarouselItems}
              scrollAnimationDuration={1000}
              mode="horizontal-stack"
              pagingEnabled
              modeConfig={{
                snapDirection: 'left',
                stackInterval: 30,
                scaleInterval: 0.08,
                opacityInterval: 0.2,
              }}
              renderItem={({item}) => (
                <View style={styles.card}>
                  <Image
                    source={item.image}
                    style={styles.fullPageImage}
                    resizeMode="contain"
                  />
                </View>
              )}
            />
          </View>
        </View>

        {/*  smallPageCarouselItems*/}

        <View style={styles.wrapper}>
          <Text style={styles.heading}>More Panels</Text>
          <View style={styles.carouselWrapper}>
            <Carousel
              loop
              width={width * 0.9}
              height={150}
              autoPlay
              data={smallPageCarouselItems}
              scrollAnimationDuration={1000}
              renderItem={({item}) => (
                <Image
                  source={item.image}
                  style={styles.smallImage}
                  resizeMode="contain"
                />
              )}
            />
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#1c2331',
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradientBackground: {
    flex: 1,
    paddingBottom: 40,
  },
  wrapper: {
    marginTop: 20,
    marginBottom: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  carouselWrapper: {
    alignItems: 'center',
  },
  normalImage: {
    width: width * 0.9,
    height: 250,
  },
  fullPageImage: {
    width: width * 1.7,
    height: 400,
    borderRadius: 24,
  },
  smallImage: {
    width: width * 0.9,
    height: 150,
    borderRadius: 24,
     
  },
  card: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OurPanels;
