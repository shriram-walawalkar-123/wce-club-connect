import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

export default function Round({ updateSubEvent, subEvent, closeModal }) {
  const [roundTime, setRoundTime] = useState(new Date());
  const [descriptions, setDescriptions] = useState(['']);
  const [showPicker, setShowPicker] = useState(false);
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    if (subEvent && subEvent.rounds) {
      setRounds(subEvent.rounds);
    }
  }, [subEvent]);

  const handleAddRound = () => {
    const newRound = {
      roundTime: roundTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: descriptions.filter(desc => desc.trim() !== ''),
    };
    const updatedRounds = [...rounds, newRound];
    setRounds(updatedRounds);
    if (updateSubEvent) {
      updateSubEvent('rounds', updatedRounds);
    }
    setRoundTime(new Date());
    setDescriptions(['']);
  };

  const addDescriptionField = () => {
    setDescriptions([...descriptions, '']);
  };

  const handleDescriptionChange = (text, index) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = text;
    setDescriptions(newDescriptions);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || roundTime;
    setShowPicker(false);
    setRoundTime(currentTime);
  };

  const renderRoundItem = ({ item, index }) => (
    <View style={styles.roundItem}>
      <Text style={styles.roundTime}>{item.roundTime}</Text>
      {item.description.map((desc, i) => (
        <Text key={i} style={styles.roundDescription}>{desc}</Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Add Round</Text>

      <View style={styles.roundsListContainer}>
        <Text style={styles.roundsListTitle}>Added Rounds</Text>
        <FlatList
          data={rounds}
          renderItem={renderRoundItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.roundsList}
          ListEmptyComponent={<Text style={styles.emptyListText}>No rounds added yet</Text>}
        />
      </View>

      <ScrollView style={styles.formContainer}>
        <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowPicker(true)}>
          <Ionicons name="time-outline" size={24} color="#2196F3" />
          <Text style={styles.timePickerText}>
            {roundTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
        
        {showPicker && (
          <DateTimePicker
            value={roundTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
        )}

        {descriptions.map((desc, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder="Round Description"
            value={desc}
            onChangeText={text => handleDescriptionChange(text, index)}
            multiline
          />
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addDescriptionField}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Add More Description</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={handleAddRound}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Add Round</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: '#ff6b6b',
    borderRadius: 20,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  formContainer: {
    flex: 1,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  timePickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  roundsListContainer: {
    marginBottom: 20,
  },
  roundsListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  roundsList: {
    maxHeight: 200,
  },
  roundItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  roundTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  roundDescription: {
    fontSize: 16,
    color: '#666',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});