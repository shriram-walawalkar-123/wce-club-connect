// src/components/ClubInfoFormModal.js

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uploadImage from '../helper/uploadImage';
import { Ionicons } from '@expo/vector-icons';
import SummaryApi from '../backendRoutes';

const ClubInfoFormModal = ({ visible, onClose, formData, fetchClubInfo }) => {
    // Fetch initial data
    useEffect(() => {
        fetchClubInfo();
    }, []);

    // Create form state with initial values
    const [formState, setFormState] = useState({
        clubName: "",
        department: "",
        establishmentYear: "",
        typeOfClub: "",
        specialization: "",
        clubLogo: "",
        motto: "",
        objectives: "",
        facultyAdvisor: [],
    });

    // Sync formData with formState when formData changes
    useEffect(() => {
        if (formData) {
            setFormState(prevState => ({
                ...prevState,
                clubName: formData.clubName || "",
                department: formData.department || "",
                establishmentYear: formData.establishmentYear || "",
                typeOfClub: formData.typeOfClub || "",
                specialization: formData.specialization || "",
                clubLogo: formData.clubLogo || "",
                motto: formData.motto || "",
                objectives: formData.objectives || "",
                facultyAdvisor: Array.isArray(formData.facultyAdvisor) ? formData.facultyAdvisor : [],
            }));
        }
    }, [formData]);

    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [newAdvisor, setNewAdvisor] = useState({ name: '', contactDetails: '', image: '' });
    const [showAdvisorModal, setShowAdvisorModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editAdvisorIndex, setEditAdvisorIndex] = useState(null);

    const handleImageSelection = async (key, imageUri) => {
        try {
            setUploading(true);
            const dataResponse = await uploadImage(imageUri);
            if (dataResponse && dataResponse.secure_url) {
                if (key === 'advisorImage') {
                    setNewAdvisor(prev => ({ ...prev, image: dataResponse.secure_url }));
                } else {
                    handleInputChange(key, dataResponse.secure_url);
                }
            } else {
                Alert.alert('Error', 'Image upload failed. Please try again.');
            }
        } catch (error) {
            Alert.alert("Error", "Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const updateData = async () => {
        setLoading(true);
        console.log("formState in clubInfoFormModal", formState);
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(SummaryApi.club_description.url, {
                method: SummaryApi.club_description.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formState,
                    facultyAdvisor: formState.facultyAdvisor || [],
                }),
            });
            const data = await response.json();
            if (data.success) {
                Alert.alert('Success', 'Club information updated successfully');
                onClose();
                await fetchClubInfo();
            } else {
                Alert.alert('Error', data.message || 'Failed to update club info.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update club info. Please try again.');
            console.log("this is clubInfoModal error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (name, value) => {
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        const currentDate = selectedDate || formState.establishmentYear;
        handleInputChange('establishmentYear', currentDate.toISOString().split('T')[0]);
    };

    const pickImage = async (key) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedImageUri = result.assets[0].uri;
            await handleImageSelection(key, selectedImageUri);
        }
    };

    const openImageModal = (imageUri) => {
        setSelectedImage(imageUri);
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        setSelectedImage('');
    };

    const addOrUpdateFacultyAdvisor = () => {
        if (newAdvisor.name && newAdvisor.contactDetails && newAdvisor.image) {
            if (editAdvisorIndex !== null) {
                const updatedAdvisors = formState.facultyAdvisor.map((advisor, index) =>
                    index === editAdvisorIndex ? newAdvisor : advisor
                );
                setFormState(prev => ({
                    ...prev,
                    facultyAdvisor: updatedAdvisors,
                }));
                setEditAdvisorIndex(null);
            } else {
                setFormState(prev => ({
                    ...prev,
                    facultyAdvisor: [...(prev.facultyAdvisor || []), newAdvisor],
                }));
            }
            setNewAdvisor({ name: '', contactDetails: '', image: '' });
            setShowAdvisorModal(false);
        } else {
            Alert.alert('Error', 'Please fill in all fields for the advisor.');
        }
    };

    const pickAdvisorImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedImageUri = result.assets[0].uri;
            await handleImageSelection('advisorImage', selectedImageUri);
        }
    };

    const editAdvisor = (index) => {
        const advisorToEdit = formState.facultyAdvisor[index];
        setNewAdvisor(advisorToEdit);
        setEditAdvisorIndex(index);
        setShowAdvisorModal(true);
    };

    const deleteAdvisor = (index) => {
        const updatedAdvisors = formState.facultyAdvisor.filter((_, idx) => idx !== index);
        setFormState(prev => ({
            ...prev,
            facultyAdvisor: updatedAdvisors,
        }));
    };

    return (
        <Modal animationType="slide" transparent={false} visible={visible}>
            <View style={styles.modalHeader}>
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close-circle" size={30} color="#f44336" />
                </TouchableOpacity>
                <Text style={styles.title}>Club Information</Text>
            </View>
            <ScrollView style={styles.container}>
                <View style={styles.inputContainer}>
                    <Ionicons name="people-outline" size={24} color="#4CAF50" />
                    <TextInput
                        style={styles.input}
                        value={formState.clubName}
                        onChangeText={(text) => handleInputChange('clubName', text)}
                        placeholder="Club Name"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="school-outline" size={24} color="#4CAF50" />
                    <TextInput
                        style={styles.input}
                        value={formState.department}
                        onChangeText={(text) => handleInputChange('department', text)}
                        placeholder="Department"
                    />
                </View>

                <Text style={styles.label}>Establishment Year:</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
                        <TextInput
                            style={styles.input}
                            value={formState.establishmentYear}
                            editable={false}
                            placeholder="Select Establishment Year"
                        />
                    </View>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={new Date(formState.establishmentYear || Date.now())}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <Text style={styles.label}>Type of Club:</Text>
                <View style={styles.radioContainer}>
                    <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => handleInputChange('typeOfClub', 'Tech')}
                    >
                        <Text style={formState.typeOfClub === 'Tech' ? styles.selectedText : styles.text}>Tech</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => handleInputChange('typeOfClub', 'Sports')}
                    >
                        <Text style={formState.typeOfClub === 'Sports' ? styles.selectedText : styles.text}>Sports</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => handleInputChange('typeOfClub', 'Cultural')}
                    >
                        <Text style={formState.typeOfClub === 'Cultural' ? styles.selectedText : styles.text}>Cultural</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="star-outline" size={24} color="#4CAF50" />
                    <TextInput
                        style={styles.input}
                        value={formState.specialization}
                        onChangeText={(text) => handleInputChange('specialization', text)}
                        placeholder="Specialization"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="pencil-outline" size={24} color="#4CAF50" />
                    <TextInput
                        style={styles.input}
                        value={formState.motto}
                        onChangeText={(text) => handleInputChange('motto', text)}
                        placeholder="Motto"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="book-outline" size={24} color="#4CAF50" />
                    <TextInput
                        style={styles.input}
                        value={formState.objectives}
                        onChangeText={(text) => handleInputChange('objectives', text)}
                        placeholder="Objectives"
                        multiline
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Club Logo:</Text>
                    <TouchableOpacity onPress={() => pickImage('clubLogo')}>
                        {formState.clubLogo ? (
                            <Image source={{ uri: formState.clubLogo }} style={styles.image} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Text style={styles.placeholderText}>Upload Logo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                {/* Faculty Advisor Section */}
                <View style={styles.advisorSection}>
                    <Text style={styles.advisorHeader}>Faculty Advisors</Text>
                    {formState.facultyAdvisor.map((advisor, index) => (
                        <View key={index} style={styles.advisorContainer}>
                            <Image source={{ uri: advisor.image }} style={styles.advisorImage} />
                            <Text style={styles.advisorName}>{advisor.name}</Text>
                            <Text style={styles.advisorContact}>{advisor.contactDetails}</Text>
                            <TouchableOpacity onPress={() => editAdvisor(index)} style={styles.editButton}>
                                <Text>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteAdvisor(index)} style={styles.deleteButton}>
                                <Text>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity onPress={() => setShowAdvisorModal(true)} style={styles.addButton}>
                        <Text>Add Faculty Advisor</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal visible={showAdvisorModal} animationType="slide">
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add Faculty Advisor</Text>
                    <TextInput
                        placeholder="Name"
                        value={newAdvisor.name}
                        onChangeText={(text) => setNewAdvisor(prev => ({ ...prev, name: text }))}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Contact Details"
                        value={newAdvisor.contactDetails}
                        onChangeText={(text) => setNewAdvisor(prev => ({ ...prev, contactDetails: text }))}
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={pickAdvisorImage} style={styles.imageButton}>
                        <Text style={styles.imageButtonText}>Upload Advisor Image</Text>
                    </TouchableOpacity>
                    {newAdvisor.image ? (
                        <Image source={{ uri: newAdvisor.image }} style={styles.image} />
                    ) : null}
                    <TouchableOpacity onPress={addOrUpdateFacultyAdvisor} style={styles.button}>
                        <Text style={styles.buttonText}>Save Advisor</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowAdvisorModal(false)}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal visible={showImageModal} animationType="slide">
                <View style={styles.imageModalContent}>
                    <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                    <TouchableOpacity onPress={closeImageModal} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <TouchableOpacity style={styles.button} onPress={updateData} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save</Text>}
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    container: {
        padding: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginLeft: 8,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    radioOption: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
    },
    selectedText: {
        color: '#007BFF',
    },
    text: {
        color: '#000',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginTop: 8,
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderStyle: 'dashed',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    placeholderText: {
        color: '#aaa',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
        marginHorizontal: 20,
        margin:5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    advisorSection: {
        marginTop: 20,
    },
    advisorHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    advisorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    advisorImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    advisorName: {
        fontWeight: 'bold',
        height:10,
        margin:5,
    },
    advisorContact: {
        color: '#555',
    },
    editButton: {
        backgroundColor: '#ffa500',
        padding: 5,
        borderRadius: 5,
        marginLeft: 5,
    },
    deleteButton: {
        backgroundColor: '#ff0000',
        padding: 5,
        borderRadius: 5,
        marginLeft: 5,
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom:30,
    },
    modalContent: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    imageButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 4,
        marginVertical: 10,
        alignItems: 'center',
    },
    imageButtonText: {
        color: '#fff',
    },
    cancelText: {
        color: '#f44336',
        textAlign: 'center',
    },
    imageModalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePreview: {
        width: '100%',
        height: '80%',
    },
    closeButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 4,
        marginTop: 10,
    },
    closeButtonText: {
        color: '#fff',
    },
});

export default ClubInfoFormModal;
