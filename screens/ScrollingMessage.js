import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');

const ScrollingMessage = ({ message }) => {
  const scrollAnim = useRef(new Animated.Value(width)).current; // Start off-screen to the right

  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -width, // Move to the left off-screen
        duration: 10000, // Adjust duration for speed
        useNativeDriver: true,
      })
    ).start();
  }, [scrollAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.scrollingText,
          {
            transform: [{ translateX: scrollAnim }],
          },
        ]}
      >
        {message}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#f8f9fa', // Change as needed
    paddingVertical: 10,
    alignItems: 'center',
  },
  scrollingText: {
    fontSize: 18,
    color: '#007BFF', // Change text color as needed
    fontWeight: 'bold',
  },
});

export default ScrollingMessage;
