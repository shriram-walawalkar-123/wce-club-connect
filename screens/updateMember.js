// UpdateMembersScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Modal, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addClubMember, updateClubMember, deleteClubMember, removeClubMember } from '../slices/clubSlice'; // Adjust import based on your file structure
import * as ImagePicker from 'expo-image-picker';
import uploadImage from '../helper/uploadImage';

const UpdateMembersScreen = () => {
    const dispatch = useDispatch();
    const members = useSelector(state => state.club.members); // Fetch members from Redux store
    const [modalVisible, setModalVisible] = useState(false);
    const [currentMember, setCurrentMember] = useState({ id: '', name: '', role: '', email: '', instagram: '', linkedin: '', slogan: '', description: '', image: '' }); // Initialize state for current member
    const [selectedImage, setSelectedImage] = useState(null); // State for selected image
    const [uploading, setUploading] = useState(false);  // State to handle loading state during image upload

    // Handle adding a new member
    const handleAddMember = () => {
        const newMemberId = Date.now().toString(); // Generate a unique ID
        dispatch(addClubMember({ ...currentMember, id: newMemberId, image: selectedImage }));
        resetModal();
    };

    // Handle updating an existing member
    const handleUpdateMember = () => {
        if (currentMember.id) {
            dispatch(updateClubMember({ ...currentMember, image: selectedImage })); // Update member in Redux store
            resetModal();
        }
    };

    // Handle deleting a member
    const handleDeleteMember = (id) => {
        dispatch(removeClubMember(id)); // Delete member from Redux store
    };

    // Open modal for adding a new member
    const openAddMemberModal = () => {
        resetModal(); // Reset fields for new member
        setModalVisible(true);
    };

    // Open modal for editing an existing member
    const openEditMemberModal = (member) => {
        setCurrentMember(member); // Set current member to edit
        setSelectedImage(member.image || null); // Set selected image to current member's image
        setModalVisible(true);
    };

    // Reset modal state
    const resetModal = () => {
        setCurrentMember({ id: '', name: '', role: '', email: '', instagram: '', linkedin: '', slogan: '', description: '', image: '' }); // Reset to initial state
        setSelectedImage(null); // Reset selected image
        setModalVisible(false); // Close modal
    };

    // Handle image selection
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
            const selectedImageUri = result.assets[0].uri;
            try {
                setUploading(true);
                // Pass the full URI to the uploadImage function
                const dataResponse = await uploadImage(selectedImageUri);  // Pass full URI
                console.log("dataResponse:", dataResponse);
              } catch (error) {
                console.error("Image upload failed:", error);
                alert("Failed to upload image. Please try again.");
              } finally {
                setUploading(false);  // Stop uploading state
              }
            setSelectedImage(result.assets[0].uri); // Set selected image URI
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Button title="Add Member" onPress={openAddMemberModal} />

            {members.map((member) => (
                <View key={member.id} style={styles.memberCard}>
                    <Text>Name: {member.name}</Text>
                    <Text>Role: {member.role}</Text>
                    <Text>Email: {member.email}</Text>
                    <Text>Instagram: {member.instagram}</Text>
                    <Text>LinkedIn: {member.linkedin}</Text>
                    <Text>Slogan: {member.slogan}</Text>
                    <Text>Description: {member.description}</Text>
                    {member.image && <Image source={{ uri: member.image }} style={styles.image} />}
                    <Button title="Edit" onPress={() => openEditMemberModal(member)} />
                    <Button title="Delete" onPress={() => handleDeleteMember(member.id)} color="red" />
                </View>
            ))}

            {/* Modal for adding or updating a member */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={resetModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{currentMember.id ? 'Edit Member' : 'Add New Member'}</Text>

                        <TextInput
                            placeholder="Member Name"
                            value={currentMember.name}
                            onChangeText={(text) => setCurrentMember({ ...currentMember, name: text })}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Role"
                            value={currentMember.role}
                            onChangeText={(text) => setCurrentMember({ ...currentMember, role: text })}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Email"
                            value={currentMember.email}
                            onChangeText={(text) => setCurrentMember({ ...currentMember, email: text })}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Instagram"
                            value={currentMember.instagram}
                            onChangeText={(text) => setCurrentMember({ ...currentMember, instagram: text })}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="LinkedIn"
                            value={currentMember.linkedin}
                            onChangeText={(text) => setCurrentMember({ ...currentMember, linkedin: text })}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Slogan"
                            value={currentMember.slogan}
                            onChangeText={(text) => setCurrentMember({ ...currentMember, slogan: text })}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Brief Description"
                            value={currentMember.description}
                            onChangeText={(text) => setCurrentMember({ ...currentMember, description: text })}
                            style={styles.input}
                        />

                        {/* Image Picker */}
                        <Button title="Pick an Image" onPress={pickImage} />
                        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}

                        <Button title={currentMember.id ? "Update Member" : "Add Member"} onPress={currentMember.id ? handleUpdateMember : handleAddMember} />
                        <Button title="Cancel" onPress={resetModal} color="red" />
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    memberCard: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 10,
        padding: 5,
        width: '100%',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 10,
        borderRadius: 8,
    },
});

export default UpdateMembersScreen;
