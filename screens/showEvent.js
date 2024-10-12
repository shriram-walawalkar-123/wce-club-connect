import React from 'react';
import { View, Text, Image, ScrollView, Linking, Alert } from 'react-native';

const ShowEvent = ({ route }) => {
  const { event } = route.params;

  const openURL = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) => Alert.alert("Failed to open URL", err.message));
    } else {
      Alert.alert("Invalid URL", "The URL is not available.");
    }
  };

  return (
    <ScrollView className="bg-gray-100 p-4">
      {/* Club Name */}
      <Text className="text-xl font-semibold text-gray-800 mb-2">
        Organized by: {event.clubName || "N/A"}
      </Text>

      {/* Event Poster */}
      {event.eventPoster ? (
        <Image
          source={{ uri: event.eventPoster }}
          className="w-full h-64 rounded-lg mb-4 shadow-lg"
          resizeMode="cover"
        />
      ) : (
        <Text className="text-center text-red-500">No Event Poster Available</Text>
      )}

      {/* Event Name and Description */}
      <Text className="text-3xl font-extrabold text-center text-blue-900 mb-3">
        {event.eventName || "Unnamed Event"}
      </Text>
      <Text className="text-lg text-gray-700 text-center mb-6">
        {event.description || "No description available."}
      </Text>

      {/* Event Date */}
      <View className="flex-row justify-center items-center mb-4">
        <Text className="text-lg font-semibold">Event Date: </Text>
        <Text className="text-lg text-gray-700">
          {event.eventDate ? new Date(event.eventDate).toLocaleString() : "Date not available"}
        </Text>
      </View>

      {/* Sponsors */}
      <Text className="text-2xl font-bold text-blue-900 mt-4 mb-2">Sponsors</Text>
      {event.sponsors && event.sponsors.length > 0 ? (
        event.sponsors.map((sponsor, index) => (
          <View key={index} className="flex-row items-center mb-4 p-3 bg-white rounded-lg shadow-sm">
            {sponsor.image ? (
              <Image
                source={{ uri: sponsor.image }}
                className="w-12 h-12 rounded-lg mr-3 shadow-md"
                resizeMode="cover"
              />
            ) : (
              <Text>No Image</Text>
            )}
            <Text className="text-base text-gray-800 font-medium">
              {sponsor.sponsorType || "Sponsor"} Sponsor
            </Text>
          </View>
        ))
      ) : (
        <Text>No sponsors available.</Text>
      )}

      {/* Sub Events */}
      <Text className="text-2xl font-bold text-blue-900 mt-6 mb-4">Sub Events</Text>

      {event.subEvents && event.subEvents.length > 0 ? (
        event.subEvents.map((subEvent, index) => (
          <View key={index} className="bg-white p-6 rounded-lg mb-6 shadow-lg border border-gray-200">
            <Text className="text-xl font-bold text-gray-800 mb-2">
              {subEvent.subEventName || "Unnamed Sub Event"}
            </Text>
            <Text className="text-base text-gray-700 mb-4">{subEvent.description || "No description available."}</Text>

            {/* Event Date and Time */}
            <Text className="text-base text-gray-700 mb-2">
              {`Date: ${subEvent.date ? new Date(subEvent.date).toLocaleDateString() : "N/A"} 
Time: ${subEvent.time || "N/A"}`}
            </Text>

            {/* Venue */}
            <Text className="text-base text-gray-700 mb-2">{`Venue: ${subEvent.venue || "Venue not available"}`}</Text>


            {/* Entry Fee */}
            <Text className="text-base text-gray-700 mb-2">{`Entry Fee: ₹${subEvent.entryFee || "N/A"}`}</Text>

            {/* Rulebook Link */}
            <Text>Rulebook : </Text> 
            <Text
              className="text-base text-blue-600  mb-4"
              onPress={() => openURL(subEvent.rulebookPDF?.uri)}
            >
               {subEvent.rulebookPDF?.uri || "No rulebook available"}
            </Text>

            {/* Contact Information */}
            <Text className="text-lg font-semibold text-gray-800 mb-2">Contacts:</Text>
            {subEvent.contacts && subEvent.contacts.length > 0 ? (
              subEvent.contacts.map((contact, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <Text className="text-base text-gray-800 font-medium mr-2">{contact.name}:</Text>
                  <Text className="text-blue-600 underline" onPress={() => openURL(`tel:${contact.phone}`)}>
                    {contact.phone}
                  </Text>
                </View>
              ))
            ) : (
              <Text>No contacts available.</Text>
            )}

            {/* Event Rounds */}
            {subEvent.rounds && subEvent.rounds.length > 0 && (
              <>
                <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">Rounds:</Text>
                {subEvent.rounds.map((round, index) => (
                  <View key={index} className="mb-4">
                    <Text className="text-base text-gray-800 font-semibold mb-1">{`Round ${index + 1}`}</Text>
                    <Text className="text-base text-gray-700 mb-2">Time : {round.roundTime || "N/A"}</Text>
                    {round.description && round.description.length > 0 ? (
                      round.description.map((desc, i) => (
                        <Text key={i} className="text-base text-gray-600 mb-1">
                          {i+1} : {desc}
                        </Text>
                      ))
                    ) : (
                      <Text>No round description available.</Text>
                    )}
                  </View>
                ))}
              </>
            )}
          </View>
        ))
      ) : (
        <Text>No sub-events available.</Text>
      )}
    </ScrollView>
  );
};

export default ShowEvent;
