import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Contact({ closeModal, subEvent, updateSubEvent }) {
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contacts, setContacts] = useState(subEvent.contacts || []);

  const addContact = () => {
    if (contactName && contactPhone) {
      const newContact = { id: Date.now().toString(), name: contactName, phone: contactPhone };
      setContacts([...contacts, newContact]);
      setContactName('');
      setContactPhone('');
    }
  };

  const deleteContact = (id) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => {
            const updatedContacts = contacts.filter(contact => contact.id !== id);
            setContacts(updatedContacts);
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleDone = () => {
    updateSubEvent('contacts', contacts);
    closeModal();
  };

  const renderContactItem = ({ item }) => (
    <View style={styles.contactItem}>
      <Text style={styles.contactText}>{item.name} - {item.phone}</Text>
      <TouchableOpacity onPress={() => deleteContact(item.id)}>
        <Icon name="close-circle" size={24} color="#FF5722" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Contacts</Text>
      
      <FlatList
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.contactList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Contact Name"
          value={contactName}
          onChangeText={setContactName}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Phone"
          value={contactPhone}
          onChangeText={setContactPhone}
          keyboardType="phone-pad"
        />
      </View>
      
      <TouchableOpacity style={styles.addButton} onPress={addContact}>
        <Icon name="add-circle" size={24} color="#FFFFFF" />
        <Text style={styles.buttonText}>Add Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.buttonText}>Done ({contacts.length} contacts)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  contactList: {
    maxHeight: 80,
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  contactText: {
    marginRight: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
});