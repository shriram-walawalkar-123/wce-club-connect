import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const AllUploadedEvents = () => {
  const events=[];
  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          All Uploaded Events
        </Text>
        {events.map((item, index) => (
          <View key={index} style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.eventName}</Text>
            <Text>{item.description}</Text>
            <Text>{`Date: ${item.eventDate}`}</Text>
            <Text>{`Club: ${item.clubName}`}</Text>
            {/* Display subevents as well if needed */}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default AllUploadedEvents;
