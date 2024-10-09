import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux'; // To get event data from Redux

const UpcomingEventsScreen = () => {
  const upcomingEvents = useSelector((state) => state.events.upcomingEvents); // Get events from Redux

  return (
    <ScrollView>
      {upcomingEvents.map((event, index) => (
        <View key={index} style={{ margin: 20 }}>
          <Image source={{ uri: event.eventImage }} style={{ width: 200, height: 200 }} />
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{event.eventName}</Text>
          <Text>Date: {event.date}</Text>
          <Text>Venue: {event.venue}</Text>
          <Text>Time: {event.time}</Text>
          <Text>Rulebook: {event.rulebook}</Text>
          <Text>Rounds: {event.rounds}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default UpcomingEventsScreen;
