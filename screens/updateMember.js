import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Modal, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uploadImage from '../helper/uploadImage';
import SummaryApi from '../backendRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateMembersScreen = () => {
    const [member, setMember] = useState({ name: '', role: '', email: '', instagram: '', linkedin: '', slogan: '', description: '', image: '' });
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    
    // Handle adding a member
    const handleAddMember = () => {
        // Add the selected image to the member state
        setMember((prevMember) => ({
            ...prevMember,
            image: selectedImage,
        }));

        // Optionally, you can store the new member in a list of members or handle further processing here
        console.log("Added Member:", member);

        // Close the modal without resetting the member state
        setModalVisible(false);
        updateData();
    };

    const updateData = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            // console.log("token",token);
            const response = await fetch(SummaryApi.club_member.url, {
                method: SummaryApi.club_member.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(member)
            });
            const data = await response.json();
            console.log("memeber data",data);        
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Handle input change
    const handleInputChange = (name, value) => {
        setMember((prevMember) => ({ ...prevMember, [name]: value }));
    };

    // Open modal for adding a member
    const openAddMemberModal = () => {
        setModalVisible(true);
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
                const dataResponse = await uploadImage(selectedImageUri); // Upload image
                setSelectedImage(dataResponse.url); // Set uploaded image URL
            } catch (error) {
                console.error("Image upload failed:", error);
                alert("Failed to upload image. Please try again.");
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Button title="Add Member" onPress={openAddMemberModal} />

            {/* Display the member details */}
            {member.name && (
                <View style={styles.memberCard}>
                    <Text>Name: {member.name}</Text>
                    <Text>Role: {member.role}</Text>
                    <Text>Email: {member.email}</Text>
                    <Text>Instagram: {member.instagram}</Text>
                    <Text>LinkedIn: {member.linkedin}</Text>
                    <Text>Slogan: {member.slogan}</Text>
                    <Text>Description: {member.description}</Text>
                    {member.image && <Image source={{ uri: member.image }} style={styles.image} />}
                </View>
            )}

            {/* Modal for adding a member */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Member</Text>

                        <TextInput
                            placeholder="Member Name"
                            value={member.name}
                            onChangeText={(text) => handleInputChange('name', text)}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Role"
                            value={member.role}
                            onChangeText={(text) => handleInputChange('role', text)}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Email"
                            value={member.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Instagram"
                            value={member.instagram}
                            onChangeText={(text) => handleInputChange('instagram', text)}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="LinkedIn"
                            value={member.linkedin}
                            onChangeText={(text) => handleInputChange('linkedin', text)}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Slogan"
                            value={member.slogan}
                            onChangeText={(text) => handleInputChange('slogan', text)}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Brief Description"
                            value={member.description}
                            onChangeText={(text) => handleInputChange('description', text)}
                            style={styles.input}
                        />

                        {/* Image Picker */}
                        <Button title="Pick an Image" onPress={pickImage} />
                        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
                        <Button title="Add Member" onPress={handleAddMember} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
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