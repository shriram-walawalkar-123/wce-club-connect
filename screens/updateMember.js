import React, { useState } from 'react';
import { View, Button, FlatList, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateClubMember, addClubMember, removeClubMember, selectClubMembers } from '../slices/clubSlice';

// Get device screen dimensions
const { width, height } = Dimensions.get('window');

const UpdateMembersScreen = () => {
  const dispatch = useDispatch();
  const members = useSelector(selectClubMembers);
  
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  
  const handleUpdateMember = (id, newDetails) => {
    dispatch(updateClubMember({ id, newDetails }));
  };

  const handleAddMember = () => {
    if (newMemberName && newMemberRole) {
      const newMember = {
        id: `${Date.now()}`, // Generate a unique id based on timestamp
        name: newMemberName,
        role: newMemberRole,
      };
      dispatch(addClubMember(newMember));
      setNewMemberName('');
      setNewMemberRole('');
    }
  };

  const handleRemoveMember = (id) => {
    dispatch(removeClubMember(id));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.memberContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Update Name"
              value={item.name}
              onChangeText={(text) => handleUpdateMember(item.id, { ...item, name: text })}
            />
            <Text style={styles.label}>Role:</Text>
            <TextInput
              style={styles.input}
              placeholder="Update Role"
              value={item.role}
              onChangeText={(text) => handleUpdateMember(item.id, { ...item, role: text })}
            />
            <Button title="Remove Member" onPress={() => handleRemoveMember(item.id)} />
          </View>
        )}
      />
      <View style={styles.addMemberContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Member Name"
          value={newMemberName}
          onChangeText={setNewMemberName}
        />
        <TextInput
          style={styles.input}
          placeholder="New Member Role"
          value={newMemberRole}
          onChangeText={setNewMemberRole}
        />
        <Button title="Add Member" onPress={handleAddMember} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#f0f0f0',
  },
  memberContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addMemberContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: width * 0.04,
    backgroundColor: '#fafafa',
    marginBottom: 10,
  },
});

export default UpdateMembersScreen;
