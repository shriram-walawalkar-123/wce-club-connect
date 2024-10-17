import React from 'react';
import { View, Text, Image, ScrollView, Linking, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const ShowEvent = ({ route }) => {
  const { event } = route.params;
  
  const openURL = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) => Alert.alert("Failed to open URL", err.message));
    } else {
      Alert.alert("Invalid URL", "The URL is not available.");
    }
  };

  // Array of pastel colors for sub-event cards
  const cardColors = [
    '#7EB5BA', 
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.clubName}>
          <FontAwesome5 name="chess-queen" size={24} color="#ffd700" /> {event.clubName || "N/A"}
        </Text>

        {event.eventPoster ? (
          <Image
            source={{ uri: event.eventPoster }}
            style={styles.eventPoster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noPosterContainer}>
            <MaterialIcons name="broken-image" size={60} color="#ecf0f1" />
            <Text style={styles.noPosterText}>No Event Poster Available</Text>
          </View>
        )}

        <Text style={styles.eventName}>
          {event.eventName || "Unnamed Event"}
        </Text>
        <Text style={styles.eventDescription}>
          {event.description || "No description available."}
        </Text>

        <View style={styles.dateContainer}>
          <Ionicons name="calendar" size={24} color="#ffd700" />
          <Text style={styles.dateText}>
            {event.eventDate ? new Date(event.eventDate).toLocaleString() : "Date not available"}
          </Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>
          <FontAwesome5 name="handshake" size={24} color="#3498db" /> Sponsors
        </Text>
        {event.sponsors && event.sponsors.length > 0 ? (
          event.sponsors.map((sponsor, index) => (
            <View key={index} style={styles.sponsorCard}>
              {sponsor.image ? (
                <Image
                  source={{ uri: sponsor.image }}
                  style={styles.sponsorImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.noSponsorImage}>
                  <FontAwesome5 name="building" size={24} color="#bdc3c7" />
                </View>
              )}
              <Text style={styles.sponsorText}>
                {sponsor.sponsorType || "Sponsor"} Sponsor
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No sponsors available.</Text>
        )}

        <Text style={[styles.sectionTitle, styles.subEventsTitle]}>
          <MaterialIcons name="event" size={24} color="#e74c3c" /> Sub Events
        </Text>

        {event.subEvents && event.subEvents.length > 0 ? (
          event.subEvents.map((subEvent, index) => (
            <View key={index} style={[styles.subEventCard, { backgroundColor: cardColors[index % cardColors.length] }]}>
              <Text style={styles.subEventName}>
                {subEvent.subEventName || "Unnamed Sub Event"}
              </Text>
              <Text style={styles.subEventDescription}>{subEvent.description || "No description available."}</Text>

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={20} color="#0B3995" />
                <Text style={styles.infoText}>
                  {`${subEvent.date ? new Date(subEvent.date).toLocaleDateString() : "N/A"} at ${subEvent.time || "N/A"}`}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#e74c3c" />
                <Text style={styles.infoText}>{subEvent.venue || "Venue not available"}</Text>
              </View>

              <View style={styles.infoRow}>
                <FontAwesome5 name="money-bill-wave" size={20} color="#0F8200" />
                <Text style={styles.infoText}>{`Entry Fee: ₹${subEvent.entryFee || "N/A"}`}</Text>
              </View>

              <TouchableOpacity
                onPress={() => openURL(subEvent.rulebookPDF?.uri)}
                style={styles.rulebookButton}
              >
                <FontAwesome5 name="file-pdf" size={20} color="#fff" />
                <Text style={styles.rulebookButtonText}>View Rulebook</Text>
              </TouchableOpacity>

              <Text style={styles.contactsTitle}>Contacts:</Text>
              {subEvent.contacts && subEvent.contacts.length > 0 ? (
                subEvent.contacts.map((contact, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => openURL(`tel:${contact.phone}`)}
                    style={styles.contactRow}
                  >
                    <Ionicons name="call-outline" size={20} color="#0F8200" />
                    <Text style={styles.contactText}>{`${contact.name}: ${contact.phone}`}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noDataText}>No contacts available.</Text>
              )}

              {subEvent.rounds && subEvent.rounds.length > 0 && (
                <View style={styles.roundsContainer}>
                  <Text style={styles.roundsTitle}>Rounds:</Text>
                  {subEvent.rounds.map((round, index) => (
                    <View key={index} style={styles.roundItem}>
                      <Text style={styles.roundName}>{`Round ${index + 1}`}</Text>
                      <View style={styles.roundTimeContainer}>
                        <MaterialCommunityIcons name="clock-outline" size={18} color="#0B3995" />
                        <Text style={styles.roundTime}>Time: {round.roundTime || "N/A"}</Text>
                      </View>
                      {round.description && round.description.length > 0 ? (
                        round.description.map((desc, i) => (
                          <Text key={i} style={styles.roundDescription}>
                            • {desc}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.noDataText}>No round description available.</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No sub-events available.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    backgroundColor: '#BB9AB1',
    padding: 20,
    margin:20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  clubName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  eventPoster: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  noPosterContainer: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  noPosterText: {
    color: '#ecf0f1',
    textAlign: 'center',
    marginTop: 10,
  },
  eventName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  sponsorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sponsorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  noSponsorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  sponsorText: {
    fontSize: 16,
    color: '#34495e',
    fontWeight: '500',
  },
  subEventsTitle: {
    marginTop: 30,
  },
  subEventCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  subEventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subEventDescription: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 10,
  },
  rulebookButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  rulebookButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: '500',
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 10,
  },
  roundsContainer: {
    marginTop: 15,
  },
  roundsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  roundItem: {
    marginBottom: 15,
  },
  roundName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#34495e',
    marginBottom: 5,
  },
  roundTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  roundTime: {
    fontSize: 15,
    color: '#34495e',
    marginLeft: 5,
  },
  roundDescription: {
    fontSize: 14,
    color: '#34495e',
    marginLeft: 10,
    marginBottom: 3,
  },
  noDataText: {
    color: '#34495e',
    fontStyle: 'italic',
  },
});

export default ShowEvent;