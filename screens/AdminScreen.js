import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, SafeAreaView, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { Button, TextInput, Card, Title, Paragraph, Avatar, Divider, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import SummaryApi from '../backendRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const AdminScreen = () => {
  const [email, setEmail] = useState('');
  const [clubName, setClubName] = useState('');
  const [clubId, setClubId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allClubId, setAllClubId] = useState([]);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  useEffect(() => {
    fetchAllClubId();
  }, []);

  const fetchAllClubId = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(SummaryApi.get_all_club_id.url, {
        method: SummaryApi.get_all_club_id.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setAllClubId(data.data);
      } else {
        setError(data.message || 'Failed to fetch club IDs');
      }
    } catch (err) {
      console.error('Error fetching club IDs:', err);
      setError('Error fetching club IDs. Please try again.');
    }
  };
  const ClubIdCreate = async () => {
    const token = await AsyncStorage.getItem("authToken");
    setLoading(true);
    setError('');
    try {
      const response = await fetch(SummaryApi.club_id_create.url, {
        method: SummaryApi.club_id_create.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email, clubName }),
      });

      const data = await response.json();
      if (data.success) {
        setClubId(data.data.clubId);
        setError('');
        fetchAllClubId();
        // Clear input fields after successful generation
        setEmail('');
        setClubName('');
      } else {
        setError(data.message || 'Failed to generate Club ID');
      }
    } catch (err) {
      console.error('Error generating Club ID:', err);
      setError('Error generating Club ID. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(clubId);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.clubCard}>
      <Card.Content>
        <View style={styles.clubHeader}>
          <Avatar.Icon size={48} icon="account-group" style={styles.clubAvatar} />
          <View style={styles.clubInfo}>
            <Title style={styles.clubName}>{item.clubName}</Title>
            <Paragraph style={styles.clubIdText}>ID: {item.clubId}</Paragraph>
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.clubDetails}>
          <MaterialCommunityIcons name="email" size={20} color="#6200ea" />
          <Paragraph style={styles.clubEmail}>{item.email}</Paragraph>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4a148c" />
      <View style={styles.header}>
        <MaterialCommunityIcons name="shield-account" size={32} color="#fff" />
        <Text style={styles.headerText}>Club Admin Panel</Text>
      </View>

      <FlatList
        data={allClubId}
        keyExtractor={(item) => item.clubId}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={
          <>
            <Card style={styles.formCard}>
              <Card.Content>
                <Title style={styles.cardTitle}>Generate New Club ID</Title>
                <TextInput
                  label="Club Name"
                  value={clubName}
                  onChangeText={setClubName}
                  style={styles.textInput}
                  left={<TextInput.Icon icon="account-group" />}
                  mode="outlined"
                />
                <TextInput
                  label="Email of club"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.textInput}
                  left={<TextInput.Icon icon="email" />}
                  mode="outlined"
                />
                {error ? <Paragraph style={styles.errorText}>{error}</Paragraph> : null}
                <Button
                  mode="contained"
                  onPress={ClubIdCreate}
                  disabled={loading}
                  style={styles.button}
                  icon="key-plus"
                  loading={loading}
                >
                  {loading ? 'Generating...' : 'Generate Club ID'}
                </Button>
              </Card.Content>
            </Card>

            {clubId && (
              <Card style={styles.generatedIdCard}>
                <Card.Content>
                  <Title style={styles.generatedIdTitle}>New Club ID Generated</Title>
                  <View style={styles.generatedIdContainer}>
                    <Paragraph style={styles.generatedIdText}>{clubId}</Paragraph>
                    <IconButton
                      icon="content-copy"
                      size={24}
                      onPress={copyToClipboard}
                      style={styles.copyButton}
                    />
                  </View>
                  {showCopiedMessage && (
                    <Paragraph style={styles.copiedMessage}>Copied to clipboard!</Paragraph>
                  )}
                </Card.Content>
              </Card>
            )}

            <Text style={styles.sectionTitle}>
              {allClubId.length > 0 ? 'All Clubs' : 'No Clubs Yet'}
            </Text>
          </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: height * 0.05,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ea',
    padding: width * 0.05,
    elevation: 4,
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: width * 0.03,
  },
  formCard: {
    margin: width * 0.05,
    elevation: 4,
    borderRadius: 10,
  },
  generatedIdCard: {
    margin: width * 0.05,
    elevation: 4,
    borderRadius: 10,
    backgroundColor: '#e8eaf6',
  },
  generatedIdTitle: {
    color: '#6200ea',
    marginBottom: height * 0.01,
  },
  generatedIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: width * 0.03,
  },
  generatedIdText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#6200ea',
  },
  copyButton: {
    margin: 0,
  },
  copiedMessage: {
    color: '#4caf50',
    marginTop: height * 0.01,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: height * 0.02,
    marginLeft: width * 0.05,
  },
  clubCard: {
    margin: width * 0.05,
    marginBottom: 0,
    elevation: 2,
    borderRadius: 10,
  },
  cardTitle: {
    color: '#6200ea',
    marginBottom: height * 0.02,
  },
  textInput: {
    marginBottom: height * 0.02,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: height * 0.02,
    backgroundColor: '#6200ea',
    paddingVertical: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: height * 0.02,
  },
  clubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clubAvatar: {
    backgroundColor: '#6200ea',
  },
  clubInfo: {
    marginLeft: width * 0.03,
    flex: 1,
  },
  clubName: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
  },
  clubIdText: {
    fontSize: width * 0.035,
    color: '#6200ea',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: height * 0.015,
  },
  clubDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clubEmail: {
    fontSize: width * 0.035,
    color: '#666',
    marginLeft: width * 0.02,
  },
});

export default AdminScreen;