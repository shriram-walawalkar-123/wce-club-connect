import React from 'react';
import { Text, View, TouchableOpacity, Linking, StyleSheet, ScrollView, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const RegisterEvent = ({ event, onClose }) => {
  const animatedValue = new Animated.Value(0);
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderSubEvent = (subEvent, index) => {
    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [50 * (index + 1), 0],
    });

    return (
      <Animated.View key={index} style={[styles.subEventContainer, { transform: [{ translateY }] }]}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <Text style={styles.subEventTitle}>
            <MaterialCommunityIcons name="star-four-points" size={24} color="#FFD700" /> {subEvent.subEventName}
          </Text>
          <Text style={styles.description}>
            <Ionicons name="information-circle-outline" size={18} color="#FFFFFF" /> {subEvent.description}
          </Text>
          <Text style={styles.details}>
            <FontAwesome5 name="money-bill-wave" size={18} color="#FFD700" /> Entry Fee: ${subEvent.entryFee}
          </Text>
          <Text style={styles.details}>
            <Ionicons name="time-outline" size={18} color="#FFFFFF" /> Date: {new Date(subEvent.date).toDateString()}
          </Text>
          <AnimatedTouchableOpacity
            style={styles.registerButton}
            onPress={() => Linking.openURL(subEvent.formUrl)}
          >
            <MaterialCommunityIcons name="rocket-launch-outline" size={24} color="#FFFFFF" />
            <Text style={styles.registerButtonText}>Register Now!</Text>
          </AnimatedTouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        <MaterialCommunityIcons name="party-popper" size={36} color="#FFD700" /> Event Registration
      </Text>
      {event && event.subEvents && event.subEvents.length > 0 ? (
        event.subEvents.map(renderSubEvent)
      ) : (
        <Text style={styles.noEventsText}>No Sub-Events available for registration.</Text>
      )}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
        <Ionicons name="close-circle-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  subEventContainer: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  gradientBackground: {
    padding: 20,
  },
  subEventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  details: {
    fontSize: 14,
    marginBottom: 6,
    color: '#FFFFFF',
  },
  registerButton: {
    backgroundColor: '#00b4d8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    elevation: 3,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#e63946',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 16,
  },
  noEventsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 20,
  },
});

export default RegisterEvent;