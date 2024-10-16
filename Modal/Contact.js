import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import React, { useState } from 'react';

export default function Contact({ setContacts, contacts, closeModal }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddContact = () => {
    setContacts([...contacts, { name, phone }]);
    closeModal(); // Close the modal after adding
  };

  return (
    <View>
      <Text>Contact</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="numeric" />
      <Button title="Add Contact" onPress={handleAddContact} />
      <Button title="Close" onPress={closeModal} />
    </View>
  );
}

const styles = StyleSheet.create({});
