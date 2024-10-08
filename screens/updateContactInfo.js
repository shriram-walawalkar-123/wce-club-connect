import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateContactInfo, selectContactInfo } from '../slices/clubSlice';
import SummaryApi from '../backendRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContactInfoScreen = () => {
    const dispatch = useDispatch();
    const contactInfo = useSelector(selectContactInfo); // Get existing contact info from Redux state

    // Function to handle the update of contact information
    const handleUpdateContactInfo = () => {
        // Prepare payload for update; only non-empty fields will be sent
        const updatedContactInfo = {};
        if (contactInfo.phone) updatedContactInfo.phone = contactInfo.phone;
        if (contactInfo.linkedin) updatedContactInfo.linkedin = contactInfo.linkedin;
        if (contactInfo.twitter) updatedContactInfo.twitter = contactInfo.twitter;
        if (contactInfo.facebook) updatedContactInfo.facebook = contactInfo.facebook;
        if (contactInfo.instagram) updatedContactInfo.instagram = contactInfo.instagram;
        if (contactInfo.github) updatedContactInfo.github = contactInfo.github;
        if (contactInfo.email) updatedContactInfo.email = contactInfo.email;
        // If all fields are empty, show an error
        if (Object.keys(updatedContactInfo).length === 0) {
            Alert.alert('Error', 'Please enter at least one field to update.');
            return;
        }
        // Dispatch updateContactInfo with updated contact details
        dispatch(updateContactInfo(updatedContactInfo));
        Alert.alert('Success', 'Contact information updated successfully!');
        updateData();
        
    };
    const updateData = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            // console.log("token",token);
            const response = await fetch(SummaryApi.club_social_media.url, {
                method: SummaryApi.club_social_media.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(contactInfo)

            });
            const data = await response.json();    
            // console.log("socail media",data);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update Club Contact Information</Text>
            <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={contactInfo.phone} // Directly use Redux state
                onChangeText={(text) => dispatch(updateContactInfo({ field: 'phone', value: text }))} // Update Redux state
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="LinkedIn Link"
                value={contactInfo.linkedin} // Directly use Redux state
                onChangeText={(text) => dispatch(updateContactInfo({ field: 'linkedin', value: text }))} // Update Redux state
            />
            <TextInput
                style={styles.input}
                placeholder="Instagram Link"
                value={contactInfo.instagram} // Directly use Redux state
                onChangeText={(text) => dispatch(updateContactInfo({ field: 'instagram', value: text }))} // Update Redux state
            />
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={contactInfo.email} // Directly use Redux state
                onChangeText={(text) => dispatch(updateContactInfo({ field: 'email', value: text }))} // Update Redux state
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Twitter link"
                value={contactInfo.twitter} // Directly use Redux state
                onChangeText={(text) => dispatch(updateContactInfo({ field: 'twitter', value: text }))} // Update Redux state
            />
            <TextInput
                style={styles.input}
                placeholder="facebook link"
                value={contactInfo.facebook} // Directly use Redux state
                onChangeText={(text) => dispatch(updateContactInfo({ field: 'facebook', value: text }))} // Update Redux state
            />
            <TextInput
                style={styles.input}
                placeholder="GitHub link"
                value={contactInfo.github} // Directly use Redux state
                onChangeText={(text) => dispatch(updateContactInfo({ field: 'github', value: text }))} // Update Redux state
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdateContactInfo}>
                <Text style={styles.buttonText}>Update Contact Info</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#e7e7c7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color:'#003366',
    },
    input: {
        height: 50,
        borderColor: '#003366',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#003366',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ContactInfoScreen;
