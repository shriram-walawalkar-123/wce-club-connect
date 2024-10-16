import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Round({ setRounds, rounds, closeModal }) {
  const [roundTime, setRoundTime] = useState(new Date());
  const [descriptions, setDescriptions] = useState(['']);
  const [showPicker, setShowPicker] = useState(false); // State to control visibility of DateTimePicker

  const handleAddRound = () => {
    setRounds([
      ...rounds,
      {
        // Format roundTime to a time-only string
        roundTime: roundTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: descriptions.filter(desc => desc.trim() !== ''),
      },
    ]);
    setRoundTime(new Date()); // Reset round time after adding
    setDescriptions(['']);
    closeModal();
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
    const currentTime = selectedTime || roundTime; // Use the selected time or the existing round time
    setShowPicker(false); // Hide the picker after selection
    setRoundTime(currentTime); // Update the round time state
  };

  return (
    <View>
      <Text>Add Round</Text>

      {/* Round Time Picker */}
      <Button title="Select Round Time" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={roundTime}
          mode="time" // Set to "time" to show clock
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <Text>Selected Time: {roundTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>

      {/* Round Descriptions */}
      {descriptions.map((desc, index) => (
        <TextInput
          key={index}
          placeholder="Round Description"
          value={desc}
          onChangeText={text => handleDescriptionChange(text, index)}
          multiline
        />
      ))}

      {/* Button to Add More Description Fields */}
      <Button title="Add More Description" onPress={addDescriptionField} />

      {/* Add Round Button */}
      <Button title="Add Round" onPress={handleAddRound} />
      <Button title="Close" onPress={closeModal} />
    </View>
  );
}

const styles = StyleSheet.create({});
