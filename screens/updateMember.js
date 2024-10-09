import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uploadImage from '../helper/uploadImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SummaryApi from '../backendRoutes';
import ShowAllUpdatedMembers from './showAllUpdatedMember';

const UpdateMembersScreen = () => {
    const [member, setMember] = useState({
        name: '',
        role: '',
        email: '',
        instagram: '',
        linkedin: '',
        slogan: '',
        description: '',
        profilepic: ''
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [existingMembers, setExistingMembers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMemberId, setCurrentMemberId] = useState(null);

    // Fetch existing members from the backend
    const fetchExistingMembers = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(SummaryApi.get_club_member.url, {
                method: SummaryApi.get_club_member.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            setExistingMembers(data.data || []);
        } catch (error) {
            console.error('Error fetching existing members:', error);
        }
    };

    // Fetch existing members when component mounts
    useEffect(() => {
        fetchExistingMembers();
    }, []);

    // Handle input change
    const handleInputChange = (name, value) => {
        setMember((prevMember) => ({ ...prevMember, [name]: value }));
    };

    // Handle adding a member
    const handleAddMember = async () => {
        const newMember = { ...member, profilepic: selectedImage };
        await updateData(newMember);
        setModalVisible(false);
        resetMemberState();
    };

    // Handle editing a member
    const handleEditMember = async () => {
        const updatedMember = { 
            ...member, 
            profilepic: selectedImage || member.profilepic, // Use the selected profilepic or the previous image
            id: currentMemberId 
        };
        await updateData(updatedMember, true);
        setModalVisible(false);
        resetMemberState();
        fetchExistingMembers(); // Refresh members after editing
    };

    const updateData = async (memberData, isEditing = false) => {
        console.log("member data ni frontend deepak",memberData);
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(isEditing ? SummaryApi.club_member_update.url : SummaryApi.club_member.url, {
                method: isEditing ? SummaryApi.club_member_update.method : SummaryApi.club_member.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(memberData),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response:", errorData.message); 
                throw new Error(`Error: ${response.status}`);
            }
    
            const data = await response.json();
            // console.log(isEditing ? "Member updated:" : "Member added:", data);
            fetchExistingMembers(); // Refresh the member list after update
        } catch (error) {
            console.error('Error updating member data:', error); 
        }
    };

    // Reset member state for new member
    const resetMemberState = () => {
        setMember({
            name: '',
            role: '',
            email: '',
            instagram: '',
            linkedin: '',
            slogan: '',
            description: '',
            profilepic: ''
        });
        setSelectedImage(null);
        setIsEditing(false);
        setCurrentMemberId(null);
    };
    // Open modal for adding a member
    const openAddMemberModal = () => {
        resetMemberState(); 
        setModalVisible(true);
    };
    // Open modal for editing a member
    const openEditMemberModal = (memberData) => {
        setMember(memberData); 
        setSelectedImage(memberData.profilepic || null); // Set selected image if exists
        setCurrentMemberId(memberData._id); 
        setIsEditing(true); 
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
            const dataResponse = await uploadImage(selectedImageUri);
            setSelectedImage(dataResponse.url);
        }
    };
    // Handle deleting a member
    const handleDeleteMember = async (id) => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(SummaryApi.club_member_delete.url, {
                method: SummaryApi.club_member_delete.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ MemberId: id }),
            });
            if (response.ok) {
                console.log("Member deleted successfully");
                fetchExistingMembers(); // Refresh the member list
            } else {
                const errorData = await response.json();
                console.error("Failed to delete member:", errorData.message);
            }
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Button title="Add Member" onPress={openAddMemberModal} />

            {/* Modal for adding or editing a member */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{isEditing ? "Edit Member" : "Add New Member"}</Text>
                        <TextInput placeholder="Member Name" value={member.name} onChangeText={(text) => handleInputChange('name', text)} style={styles.input} />
                        <TextInput placeholder="Role" value={member.role} onChangeText={(text) => handleInputChange('role', text)} style={styles.input} />
                        <TextInput placeholder="Email" value={member.email} onChangeText={(text) => handleInputChange('email', text)} style={styles.input} />
                        <TextInput placeholder="Instagram" value={member.instagram} onChangeText={(text) => handleInputChange('instagram', text)} style={styles.input} />
                        <TextInput placeholder="LinkedIn" value={member.linkedin} onChangeText={(text) => handleInputChange('linkedin', text)} style={styles.input} />
                        <TextInput placeholder="Slogan" value={member.slogan} onChangeText={(text) => handleInputChange('slogan', text)} style={styles.input} />
                        <TextInput placeholder="Brief Description" value={member.description} onChangeText={(text) => handleInputChange('description', text)} style={styles.input} />

                        {/* Image Picker */}
                        <Button title="Pick an Image" onPress={pickImage} />
                        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.profilepic} />}
                        <Button title={isEditing ? "Update Member" : "Add Member"} onPress={isEditing ? handleEditMember : handleAddMember} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
                    </View>
                </View>
            </Modal>

            {/* Display all updated members */}
            <ScrollView>
                {existingMembers.map((memberData) => (
                    <View key={memberData._id} style={styles.memberCard}>
                        <ShowAllUpdatedMembers allMembers={[memberData]} />
                        <View style={styles.buttonContainer}>
                            <Button title="Edit" onPress={() => openEditMemberModal(memberData)} />
                            <Button title="Delete" onPress={() => handleDeleteMember(memberData._id)} color="red" />
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

// Styles for the component
const styles = StyleSheet.create({
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
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    profilepic: {
        width: 100,
        height: 100,
        marginTop: 10,
    },
    memberCard: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
});

export default UpdateMembersScreen;
