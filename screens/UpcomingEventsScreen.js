import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';

const UpcomingEventsScreen = () => {
  // Demo data for upcoming events
  const upcomingEvents = [
    {
      eventImage: 'https://example.com/event1.jpg',
      eventName: 'Tech Fest 2024',
      date: '2024-12-01',
      venue: 'Auditorium A',
      time: '10:00 AM',
      rulebook: 'https://example.com/rulebook1.pdf',
      rounds: '3',
    },
    {
      eventImage: 'https://example.com/event2.jpg',
      eventName: 'Cultural Night',
      date: '2024-12-05',
      venue: 'Main Hall',
      time: '6:00 PM',
      rulebook: 'https://example.com/rulebook2.pdf',
      rounds: '2',
    },
    {
      eventImage: 'https://example.com/event3.jpg',
      eventName: 'Sports Meet 2024',
      date: '2024-12-10',
      venue: 'Sports Ground',
      time: '8:00 AM',
      rulebook: 'https://example.com/rulebook3.pdf',
      rounds: '5',
    },
  ];

  const renderItem = ({ item }) => (
    <View style={{ margin: 20, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 }}>
      <Image source={{ uri: item.eventImage }} style={{ width: 200, height: 200, borderRadius: 10 }} />
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginVertical: 5 }}>{item.eventName}</Text>
      <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text>Venue: {item.venue}</Text>
      <Text>Time: {item.time}</Text>
      <Text>Rulebook: <Text style={{ color: 'blue' }}>{item.rulebook}</Text></Text>
      <Text>Rounds: {item.rounds}</Text>
    </View>
  );

  return (
    <FlatList
      data={upcomingEvents}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 20 }} // Extra padding for bottom
    />
  );
};

export default UpcomingEventsScreen;
