<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Image, ScrollView } from 'react-native';
=======
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Modal, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addClubMember, updateClubMember, removeClubMember } from '../slices/clubSlice'; // Adjust import based on your file structure
>>>>>>> Stashed changes
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
        image: ''
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [existingMembers, setExistingMembers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMemberId, setCurrentMemberId] = useState(null);

<<<<<<< Updated upstream
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
        const newMember = { ...member, image: selectedImage };
        await updateData(newMember);
        setModalVisible(false);
        resetMemberState();
    };

    // Handle editing a member
    const handleEditMember = async () => {
        const updatedMember = { ...member, image: selectedImage, id: currentMemberId };
        await updateData(updatedMember, true);
        setModalVisible(false);
        resetMemberState();
        fetchExistingMembers(); // Refresh members after editing
    };

    const updateData = async (memberData, isEditing = false) => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(SummaryApi.club_member.url, {
                method: isEditing ? 'PUT' : SummaryApi.club_member.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(memberData)
            });
            const data = await response.json();
            console.log(isEditing ? "Member updated:" : "Member added:", data);
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
            image: ''
        });
        setSelectedImage(null);
        setIsEditing(false);
        setCurrentMemberId(null);
    };

    // Open modal for adding a member
=======
    const handleAddMember = () => {
        const newMemberId = Date.now().toString(); // Generate a unique ID
        dispatch(addClubMember({ ...currentMember, id: newMemberId, image: selectedImage }));
        resetModal();
    };

    const handleUpdateMember = () => {
        if (currentMember.id) {
            dispatch(updateClubMember({ ...currentMember, image: selectedImage })); // Update member in Redux store
            resetModal();
        }
    };

    const handleDeleteMember = (id) => {
        dispatch(removeClubMember(id)); // Delete member from Redux store
    };

>>>>>>> Stashed changes
    const openAddMemberModal = () => {
        resetMemberState(); // Reset state to avoid carrying over old data
        setModalVisible(true);
    };

<<<<<<< Updated upstream
    // Open modal for editing a member
    const openEditMemberModal = (memberData) => {
        setMember(memberData); // Set member data to edit
        setSelectedImage(memberData.image); // Set selected image if exists
        setCurrentMemberId(memberData._id); // Set current member ID
        setIsEditing(true); // Set editing state
        setModalVisible(true); // Open modal
=======
    const openEditMemberModal = (member) => {
        setCurrentMember(member); // Set current member to edit
        setSelectedImage(member.image || null); // Set selected image to current member's image
        setModalVisible(true);
    };

    const resetModal = () => {
        setCurrentMember({ id: '', name: '', role: '', email: '', instagram: '', linkedin: '', slogan: '', description: '', image: '' }); // Reset to initial state
        setSelectedImage(null); // Reset selected image
        setModalVisible(false); // Close modal
>>>>>>> Stashed changes
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
            const selectedImageUri = result.assets[0].uri;
<<<<<<< Updated upstream
            const dataResponse = await uploadImage(selectedImageUri);
            setSelectedImage(dataResponse.url);
        }
    };

    // Handle deleting a member
    const handleDeleteMember = async (id) => {
        console.log("Deleting member with ID:", id);
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
=======
            try {
                setUploading(true);
                const dataResponse = await uploadImage(selectedImageUri);  // Pass full URI
                console.log("dataResponse:", dataResponse);
              } catch (error) {
                console.error("Image upload failed:", error);
                alert("Failed to upload image. Please try again.");
              } finally {
                setUploading(false);  // Stop uploading state
              }
            setSelectedImage(result.assets[0].uri); // Set selected image URI
>>>>>>> Stashed changes
        }
    };

    return (
<<<<<<< Updated upstream
        <View style={{ flex: 1, padding: 20 }}>
            <Button title="Add Member" onPress={openAddMemberModal} />

            {/* Modal for adding or editing a member */}
=======
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Button title="Add Member" onPress={openAddMemberModal} color='#003366' />

            {members.map((member) => (
                <View key={member.id} style={styles.memberCard} >
              
                        <Text>Name: {member.name}</Text>
                        <Text>Role: {member.role}</Text>
                        <Text>Email: {member.email}</Text>
                        <Text>Instagram: {member.instagram}</Text>
                        <Text>LinkedIn: {member.linkedin}</Text>
                        <Text>Slogan: {member.slogan}</Text>
                        <Text>Description: {member.description}</Text>
         
                    
                    {member.image && <Image source={{ uri: member.image }} style={styles.image} />}
                    <Button title="Edit" onPress={() => openEditMemberModal(member)} color='#003366'/>
                    <Button title="Delete" onPress={() => handleDeleteMember(member.id)} color="red" />
                </View>
            ))}

            {/* Modal for adding or updating a member */}
>>>>>>> Stashed changes
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
<<<<<<< Updated upstream
                        <Text style={styles.modalTitle}>{isEditing ? "Edit Member" : "Add New Member"}</Text>
                        <TextInput placeholder="Member Name" value={member.name} onChangeText={(text) => handleInputChange('name', text)} style={styles.input} />
                        <TextInput placeholder="Role" value={member.role} onChangeText={(text) => handleInputChange('role', text)} style={styles.input} />
                        <TextInput placeholder="Email" value={member.email} onChangeText={(text) => handleInputChange('email', text)} style={styles.input} />
                        <TextInput placeholder="Instagram" value={member.instagram} onChangeText={(text) => handleInputChange('instagram', text)} style={styles.input} />
                        <TextInput placeholder="LinkedIn" value={member.linkedin} onChangeText={(text) => handleInputChange('linkedin', text)} style={styles.input} />
                        <TextInput placeholder="Slogan" value={member.slogan} onChangeText={(text) => handleInputChange('slogan', text)} style={styles.input} />
                        <TextInput placeholder="Brief Description" value={member.description} onChangeText={(text) => handleInputChange('description', text)} style={styles.input} />
=======
                        <Text style={styles.modalTitle }>{currentMember.id ? 'Edit Member' : 'Add New Member'}</Text>

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
>>>>>>> Stashed changes

                        <Button title="Pick an Image" onPress={pickImage} color='#003366'/>
                        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
<<<<<<< Updated upstream
                        <Button title={isEditing ? "Update Member" : "Add Member"} onPress={isEditing ? handleEditMember : handleAddMember} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
=======

                        <Button title={currentMember.id ? "Update Member" : "Add Member"} onPress={currentMember.id ? handleUpdateMember : handleAddMember}  color='#003366'/>
                        <Button title="Cancel" onPress={resetModal} color="pink" />
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#e7e7c7',
        padding: 20,
        justifyContent: 'flex-start', // To ensure content starts from top
        gap:20,
        
    },
    memberCard: {
        marginBottom: 20,
        padding: 10,
        color:'lightblue',
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 2,
        gap:5,
          
    },
    
>>>>>>> Stashed changes
    input: {
        borderBottomWidth: 1,
        marginBottom: 10,
        padding: 5,
        width: '100%',
        color:'#003366',
        
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
<<<<<<< Updated upstream
        backgroundColor: '#fff',
        borderRadius: 10,
=======
        backgroundColor: '#e7e7c7',
        borderRadius: 10,
        alignItems: 'center',
        gap:5,
>>>>>>> Stashed changes
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
<<<<<<< Updated upstream
        textAlign: 'center',
=======

>>>>>>> Stashed changes
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
        alignSelf: 'center',
    },
    memberCard: {
        marginVertical: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default UpdateMembersScreen;
