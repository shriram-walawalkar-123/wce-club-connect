import React from 'react';
import { View, Text, Image, ScrollView, Linking } from 'react-native';

const ShowEvent = ({ route }) => {
  const { event } = route.params;

  return (
    <ScrollView className="bg-gray-100 p-4">
      {/* Club Name */}
      <Text className="text-xl font-semibold text-gray-800 mb-2">
        Organized by: {event.clubName}
      </Text>

      {/* Event Poster */}
      <Image
        source={{ uri: event.eventPoster }}
        className="w-full h-64 rounded-lg mb-4 shadow-lg"
        resizeMode="cover"
      />

      {/* Event Name and Description */}
      <Text className="text-3xl font-extrabold text-center text-blue-900 mb-3">
        {event.eventName}
      </Text>
      <Text className="text-lg text-gray-700 text-center mb-6">
        {event.description}
      </Text>

      {/* Event Date */}
      <View className="flex-row justify-center items-center mb-4">
        <Text className="text-lg font-semibold">Event Date: </Text>
        <Text className="text-lg text-gray-700">
          {new Date(event.eventDate).toLocaleString()}
        </Text>
      </View>

      {/* Sponsors */}
      <Text className="text-2xl font-bold text-blue-900 mt-4 mb-2">Sponsors</Text>
      {event.sponsors.map((sponsor, index) => (
        <View key={index} className="flex-row items-center mb-4 p-3 bg-white rounded-lg shadow-sm">
          <Image
            source={{ uri: sponsor.image }}
            className="w-12 h-12 rounded-lg mr-3 shadow-md"
            resizeMode="cover"
          />
          <Text className="text-base text-gray-800 font-medium">
            {sponsor.sponsorType} Sponsor
          </Text>
        </View>
      ))}

      {/* Sub Events */}
      <Text className="text-2xl font-bold text-blue-900 mt-6 mb-4">Sub Events</Text>
      {event.subEvents.map((subEvent, index) => (
        <View key={index} className="bg-white p-6 rounded-lg mb-6 shadow-lg border border-gray-200">
          <Text className="text-xl font-bold text-gray-800 mb-2">
            {subEvent.subEventName}
          </Text>
          <Text className="text-base text-gray-700 mb-4">{subEvent.description}</Text>
          
          {/* Event Date and Time */}
          <Text className="text-base text-gray-700 mb-2">
            {`Date: ${new Date(subEvent.date).toLocaleDateString()} | Time: ${subEvent.time}`}
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

          {/* Contact Information */}
          <Text className="text-lg font-semibold text-gray-800 mb-2">Contacts:</Text>
          {subEvent.contacts.map((contact, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Text className="text-base text-gray-800 font-medium mr-2">{contact.name}:</Text>
              <Text className="text-blue-600 underline" onPress={() => Linking.openURL(`tel:${contact.phone}`)}>
                {contact.phone}
              </Text>
            </View>
          ))}

          {/* Event Rounds */}
          {subEvent.rounds && (
            <>
              <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">Rounds:</Text>
              {subEvent.rounds.map((round, index) => (
                <View key={index} className="mb-4">
                  <Text className="text-base text-gray-800 font-semibold mb-1">{`Round ${index + 1}`}</Text>
                  <Text className="text-base text-gray-700 mb-2">Time: {round.roundTime}</Text>
                  {round.description.map((desc, i) => (
                    <Text key={i} className="text-base text-gray-600 mb-1">
                      {desc}
                    </Text>
                  ))}
                </View>
              ))}
            </>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default ShowEvent;
