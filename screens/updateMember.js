import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Image, ScrollView, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import uploadImage from '../helper/uploadImage';
import SummaryApi from '../backendRoutes';

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

    const navigation = useNavigation();

    useEffect(() => {
        fetchExistingMembers();
    }, []);

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

    const handleInputChange = (name, value) => {
        setMember((prevMember) => ({ ...prevMember, [name]: value }));
    };

    const handleAddMember = async () => {
        const newMember = { ...member, profilepic: selectedImage };
        await updateData(newMember);
        setModalVisible(false);
        resetMemberState();
    };

    const handleEditMember = async () => {
        const updatedMember = { 
            ...member, 
            profilepic: selectedImage || member.profilepic,
            id: currentMemberId 
        };
        await updateData(updatedMember, true);
        setModalVisible(false);
        resetMemberState();
    };

    const updateData = async (memberData, isEditing = false) => {
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
            fetchExistingMembers();
        } catch (error) {
            console.error('Error updating member data:', error); 
        }
    };

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
                fetchExistingMembers();
            } else {
                const errorData = await response.json();
                console.error("Failed to delete member:", errorData.message);
            }
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    };

    const openEditMemberModal = (memberData) => {
        setIsEditing(true);
        setCurrentMemberId(memberData._id);
        setMember(memberData);
        setSelectedImage(memberData.profilepic);
        setModalVisible(true);
    };

    const renderMemberItem = ({ item }) => (
        <View style={styles.memberItem}>
            <View style={styles.memberHeader}>
                <Image source={{ uri: item.profilepic }} style={styles.memberImage} />
                <View>
                    <Text style={styles.memberName}>{item.name}</Text>
                    <Text style={styles.memberRole}>{item.role}</Text>
                </View>
            </View>
            <View style={styles.memberInfo}>
                <Text style={styles.memberText}><Ionicons name="mail" size={16} color="#4B5563" /> {item.email}</Text>
                <Text style={styles.memberText}><FontAwesome5 name="instagram" size={16} color="#4B5563" /> {item.instagram}</Text>
                <Text style={styles.memberText}><FontAwesome5 name="linkedin" size={16} color="#4B5563" /> {item.linkedin}</Text>
            </View>
            <Text style={styles.memberSlogan}>"{item.slogan}"</Text>
            <Text style={styles.memberDescription}>{item.description}</Text>
            <View style={styles.memberActions}>
                <TouchableOpacity onPress={() => openEditMemberModal(item)} style={styles.editButton}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteMember(item._id)} style={styles.deleteButton}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.addButtonContainer}>
                <TouchableOpacity 
                    onPress={() => { setModalVisible(true); resetMemberState(); }}
                    style={styles.addButton}
                >
                    <Ionicons name="add-circle-outline" size={24} color="white" />
                    <Text style={styles.addButtonText}>Add Member</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={existingMembers}
                renderItem={renderMemberItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.flatListContainer}
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{isEditing ? "Edit Member" : "Add New Member"}</Text>
                        <ScrollView>
                            {['name', 'role', 'email', 'instagram', 'linkedin', 'slogan', 'description'].map((field, index) => (
                                <View style={styles.inputContainer} key={index}>
                                    <Text style={styles.inputLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                                    <View style={styles.inputWrapper}>
                                        {field === 'description' ? (
                                            <TextInput
                                                placeholder={`Brief ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                                value={member[field]}
                                                onChangeText={(text) => handleInputChange(field, text)}
                                                multiline
                                                numberOfLines={4}
                                                style={styles.textArea}
                                            />
                                        ) : (
                                            <TextInput
                                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                                value={member[field]}
                                                onChangeText={(text) => handleInputChange(field, text)}
                                                style={styles.textInput}
                                            />
                                        )}
                                    </View>
                                </View>
                            ))}
                            
                            <TouchableOpacity onPress={pickImage} style={styles.pickImageButton}>
                                <MaterialIcons name="add-photo-alternate" size={24} color="white" />
                                <Text style={styles.buttonText}>Pick an Image</Text>
                            </TouchableOpacity>

                            {selectedImage && (
                                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                            )}

                            <TouchableOpacity 
                                onPress={isEditing ? handleEditMember : handleAddMember}
                                style={styles.saveButton}
                            >
                                <Text style={styles.buttonText}>{isEditing ? "Update Member" : "Save Member"}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F3F4F6',
      padding: 16,
    },
    addButtonContainer: {
      alignItems: 'flex-end',
      marginBottom: 20,
    },
    addButton: {
      backgroundColor: '#4F46E5',
      padding: 12,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    addButtonText: {
      color: 'white',
      marginLeft: 8,
      fontWeight: 'bold',
      fontSize: 16,
    },
    flatListContainer: {
      paddingBottom: 100,
    },
    memberItem: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    memberHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    memberImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
    },
    memberName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1F2937',
    },
    memberRole: {
      fontSize: 16,
      color: '#4B5563',
      marginTop: 4,
    },
    memberInfo: {
      marginVertical: 12,
    },
    memberText: {
      fontSize: 16,
      color: '#4B5563',
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    memberSlogan: {
      fontStyle: 'italic',
      color: '#6B7280',
      marginVertical: 8,
      fontSize: 16,
    },
    memberDescription: {
      color: '#374151',
      marginVertical: 8,
      fontSize: 16,
      lineHeight: 24,
    },
    memberActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    editButton: {
      backgroundColor: '#4F46E5',
      padding: 12,
      borderRadius: 8,
      width: '48%',
      alignItems: 'center',
    },
    deleteButton: {
      backgroundColor: '#DC2626',
      padding: 12,
      borderRadius: 8,
      width: '48%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 24,
      width: '90%',
      maxHeight: '90%',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#1F2937',
    },
    inputContainer: {
      marginBottom: 16,
    },
    inputLabel: {
      fontWeight: 'bold',
      marginBottom: 8,
      fontSize: 16,
      color: '#4B5563',
    },
    inputWrapper: {
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 8,
      backgroundColor: '#F9FAFB',
    },
    textInput: {
      padding: 12,
      height: 48,
      fontSize: 16,
    },
    textArea: {
      padding: 12,
      height: 100,
      fontSize: 16,
      textAlignVertical: 'top',
    },
    pickImageButton: {
      flexDirection: 'row',
      backgroundColor: '#4F46E5',
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 16,
    },
    imagePreview: {
      width: 120,
      height: 120,
      borderRadius: 12,
      marginVertical: 12,
      alignSelf: 'center',
    },
    saveButton: {
      backgroundColor: '#4F46E5',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    cancelButton: {
      backgroundColor: '#EF4444',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
  });

export default UpdateMembersScreen;
