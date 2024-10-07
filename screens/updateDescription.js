// src/components/UpdateClubInfoScreen.js
import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
    Image,
    Modal,
    KeyboardAvoidingView,
    ToastAndroid,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateClubInfo } from '../slices/clubSlice'; // Adjust the path as necessary
import uploadImage from '../helper/uploadImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SummaryApi from '../backendRoutes';

const UpdateClubInfoScreen = () => {
    const dispatch = useDispatch();
    const club = useSelector((state) => state.club.clubInfo); // Fetch club info from Redux store
    const [formState, setFormState] = useState({
        clubName: '',
        department: '',
        establishmentYear: '',
        typeOfClub: '',
        specialization: '',
        clubLogo: '',
        motto: '',
        objectives: '',
        facultyAdvisors: [],
    });

    const updateData = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            // console.log("token",token);
            const response = await fetch(SummaryApi.club_description.url, {
                method: SummaryApi.club_description.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(formState)
            });
            const data = await response.json();        
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showAdvisorModal, setShowAdvisorModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false); // New state for image modal
    const [selectedImage, setSelectedImage] = useState(''); // State to store the selected image URI
    const [newAdvisor, setNewAdvisor] = useState({ name: '', contactDetails: '', image: '' });
    const [uploading, setUploading] = useState(false);  // State to handle loading state during image upload
    useEffect(() => {
        if (club) {
            setFormState(club); // Set the form state from Redux store
        }
    }, [club]);

    const pickImage = async (key) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedImageUri = result.assets[0].uri;
            if (key === 'advisorImage') {
                try {
                    setUploading(true);
                    // Pass the full URI to the uploadImage function
                    const dataResponse = await uploadImage(selectedImageUri);  // Pass full URI
                    // console.log("dataResponse:", dataResponse);
                  } catch (error) {
                    console.error("Image upload failed:", error);
                    alert("Failed to upload image. Please try again.");
                  } finally {
                    setUploading(false);  // Stop uploading state
                  }
                handleAdvisorInputChange('image', result.assets[0].uri); // Use the first asset's uri for advisor image
            } else {
                try {
                    setUploading(true);
                    // Pass the full URI to the uploadImage function
                    const dataResponse = await uploadImage(selectedImageUri);  // Pass full URI
                    // console.log("dataResponse:", dataResponse);
                  } catch (error) {
                    console.error("Image upload failed:", error);
                    alert("Failed to upload image. Please try again.");
                  } finally {
                    setUploading(false);  // Stop uploading state
                  }
                handleInputChange(key, result.assets[0].uri); // Use the first asset's uri for club logo
            }
        } else {
            console.log('Image picker was cancelled or no image selected');
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        const currentDate = selectedDate || formState.establishmentYear;
        handleInputChange('establishmentYear', currentDate.toISOString().split('T')[0]);
    };

    const handleInputChange = (name, value) => {
        setFormState({ ...formState, [name]: value });
    };

    const handleAdvisorInputChange = (name, value) => {
        setNewAdvisor({ ...newAdvisor, [name]: value });
    };

    const addFacultyAdvisor = () => {
        setFormState({
            ...formState,
            facultyAdvisors: [...formState.facultyAdvisors, newAdvisor],
        });
        setShowAdvisorModal(false);
        setNewAdvisor({ name: '', contactDetails: '', image: '' });
    };

    const handleUpdate = () => {
        dispatch(updateClubInfo(formState)); // Dispatch update action
        updateData();
        Alert.alert('Success', 'Club information updated successfully');
    };

    const openImageModal = (imageUri) => {
        setSelectedImage(imageUri); // Set the selected image for the modal
        setShowImageModal(true); // Show the image modal
    };

    const closeImageModal = () => {
        setShowImageModal(false); // Close the image modal
        setSelectedImage(''); // Clear the selected image URI
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ScrollView>
                <Text style={styles.label}>Club Name:</Text>
                <TextInput
                    style={styles.input}
                    value={formState.clubName}
                    onChangeText={(text) => handleInputChange('clubName', text)}
                />

                <Text style={styles.label}>Department:</Text>
                <TextInput
                    style={styles.input}
                    value={formState.department}
                    onChangeText={(text) => handleInputChange('department', text)}
                />

                <Text style={styles.label}>Establishment Year:</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <TextInput
                        style={styles.input}
                        value={formState.establishmentYear}
                        editable={false}
                        placeholder="Select Establishment Year"
                    />
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
                        <Text style={formState.typeOfClub === 'Tech' ? styles.selectedRadio : styles.radio}>Tech</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => handleInputChange('typeOfClub', 'Non-Tech')}
                    >
                        <Text style={formState.typeOfClub === 'Non-Tech' ? styles.selectedRadio : styles.radio}>Non-Tech</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Specialization:</Text>
                <TextInput
                    style={styles.input}
                    value={formState.specialization}
                    onChangeText={(text) => handleInputChange('specialization', text)}
                />

                <Text style={styles.label}>Club Logo:</Text>
                {formState.clubLogo ? (
                    <TouchableOpacity onPress={() => openImageModal(formState.clubLogo)}>
                        <Image source={{ uri: formState.clubLogo }} style={styles.logo} />
                    </TouchableOpacity>
                ) : (
                    <Text>No logo selected</Text>
                )}
                <Button title="Choose Logo" onPress={() => pickImage('clubLogo')} />

                <Text style={styles.label}>Motto:</Text>
                <TextInput
                    style={styles.input}
                    value={formState.motto}
                    onChangeText={(text) => handleInputChange('motto', text)}
                />

                <Text style={styles.label}>Objectives:</Text>
                <TextInput
                    style={styles.input}
                    value={formState.objectives}
                    onChangeText={(text) => handleInputChange('objectives', text)}
                    multiline
                />

                {formState.facultyAdvisors.map((advisor, index) => (
                    <View key={index}>
                        <Text style={styles.label}>Faculty Advisor {index + 1} Name:</Text>
                        <TextInput
                            style={styles.input}
                            value={advisor.name}
                            editable={false} // Existing advisors can't be edited here
                        />

                        <Text style={styles.label}>Faculty Advisor {index + 1} Contact:</Text>
                        <TextInput
                            style={styles.input}
                            value={advisor.contactDetails}
                            editable={false}
                        />

                        <Text style={styles.label}>Faculty Advisor {index + 1} Image:</Text>
                        {advisor.image ? (
                            <TouchableOpacity onPress={() => openImageModal(advisor.image)}>
                                <Image source={{ uri: advisor.image }} style={styles.logo} />
                            </TouchableOpacity>
                        ) : (
                            <Text>No image available</Text>
                        )}
                    </View>
                ))}

                <Button title="Add Faculty Advisor" onPress={() => setShowAdvisorModal(true)} />

                <Modal visible={showAdvisorModal} animationType="slide" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalSmall}>
                            <Text style={styles.label}>Faculty Advisor Name:</Text>
                            <TextInput
                                style={styles.input}
                                value={newAdvisor.name}
                                onChangeText={(text) => handleAdvisorInputChange('name', text)}
                            />

                            <Text style={styles.label}>Faculty Advisor Contact:</Text>
                            <TextInput
                                style={styles.input}
                                value={newAdvisor.contactDetails}
                                onChangeText={(text) => handleAdvisorInputChange('contactDetails', text)}
                            />

                            <Button title="Pick Advisor Image" onPress={() => pickImage('advisorImage')} />
                            {newAdvisor.image ? (
                                <Image source={{ uri: newAdvisor.image }} style={styles.logo} />
                            ) : (
                                <Text>No advisor image selected</Text>
                            )}
                            <Button title="Add Advisor" onPress={addFacultyAdvisor} />
                            <Button title="Cancel" onPress={() => setShowAdvisorModal(false)} />
                        </View>
                    </View>
                </Modal>

                <Button title="Update Club Info" onPress={handleUpdate} />

                {/* Image Modal for Viewing Larger Image */}
                <Modal visible={showImageModal} animationType="slide" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalImageContainer}>
                            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                            <Button title="Close" onPress={closeImageModal} />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
        borderRadius: 10,
        resizeMode: 'contain', // Ensures the image fits within the square
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    radioOption: {
        flex: 1,
        alignItems: 'center',
    },
    radio: {
        fontSize: 16,
        color: '#333',
    },
    selectedRadio: {
        fontSize: 16,
        color: '#007BFF',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalSmall: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalImage: {
        width: 300, // Adjust width for modal image
        height: 300, // Adjust height for modal image to be square
        resizeMode: 'contain',
        marginBottom: 10,
    },
});

export default UpdateClubInfoScreen;