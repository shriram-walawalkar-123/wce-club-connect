import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';

const ShowEvent = ({ route }) => {
  const { event } = route.params;

  return (
    <ScrollView className="bg-gray-100 p-4">
      {/* Event Poster */}
      <Image
        source={{ uri: event.eventPoster }}
        className="w-full h-48 rounded-lg mb-4"
        resizeMode="cover"
      />

      {/* Event Name and Description */}
      <Text className="text-2xl font-bold text-center mb-2">
        {event.eventName}
      </Text>
      <Text className="text-base text-gray-600 text-center mb-4">
        {event.description}
      </Text>

      {/* Event Date */}
      <Text className="text-lg font-semibold mb-2">Event Date:</Text>
      <Text className="text-base text-gray-700">
        {new Date(event.eventDate).toLocaleString()}
      </Text>

      {/* Sponsors */}
      <Text className="text-lg font-semibold mt-4 mb-2">Sponsors:</Text>
      {event.sponsors.map((sponsor, index) => (
        <View key={index} className="flex-row items-center mb-4">
          <Image
            source={{ uri: sponsor.image }}
            className="w-12 h-12 rounded-lg mr-3"
            resizeMode="cover"
          />
          <Text className="text-base text-gray-800">
            {sponsor.sponsorType} Sponsor
          </Text>
        </View>
      ))}

      {/* Sub Events */}
      <Text className="text-lg font-semibold mt-4 mb-2">Sub Events:</Text>
      {event.subEvents.map((subEvent, index) => (
        <View key={index} className="p-4 bg-white rounded-lg mb-4 border border-gray-200">
          <Text className="text-xl font-semibold mb-1">
            {subEvent.subEventName}
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            {subEvent.description}
          </Text>
          <Text className="text-base text-gray-600">
            {`Date: ${new Date(subEvent.date).toLocaleDateString()} Time: ${
              subEvent.time
            }`}
          </Text>
          <Text className="text-base text-gray-600">{`Venue: ${subEvent.venue}`}</Text>
          <Text className="text-base text-gray-600 mb-2">{`Entry Fee: ₹${subEvent.entryFee}`}</Text>
          <Text className="text-blue-600 underline">
            Rulebook: {subEvent.rulebookPDF}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default ShowEvent;
