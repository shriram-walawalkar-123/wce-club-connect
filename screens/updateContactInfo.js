import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SummaryApi from '../backendRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard'; // Change this line

const ContactInfoScreen = () => {
    const [contact, setContact] = useState({
        linkedin: "",
        twitter: "",
        github: "",
        instagram: "",
        facebook: "",
        youtube: "",
        email: "",
        phoneNumber: "",
        website: "",
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [tempContact, setTempContact] = useState({ ...contact });

    const FetchContactInfo = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(SummaryApi.get_club.url, {
                method: SummaryApi.get_club.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if (data.success === true) {
                setContact(data.club);
                setTempContact(data.club); // Initialize tempContact with fetched data
            }
        } catch (error) {
            console.error('Error fetching contact info:', error);
        }
    };

    const updateData = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(SummaryApi.club_social_media.url, {
                method: SummaryApi.club_social_media.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tempContact)
            });
            const data = await response.json();
            if (data.success) {
                setContact(tempContact);
                Alert.alert('Success', 'Contact information updated successfully!');
            } else {
                Alert.alert('Error', 'Failed to update contact information');
            }
        } catch (error) {
            console.error('Error updating contact data:', error);
        }
    };

    useEffect(() => {
        FetchContactInfo();
    }, []);

    const handleUpdatePress = async () => {
        await updateData();
        setModalVisible(false);
        FetchContactInfo();
    };

    const copyToClipboard = async (value) => {
        await Clipboard.setStringAsync(value); // Update this line
        Alert.alert('Copied to Clipboard', value);
    };

    const openLink = (url) => {
        Linking.openURL(url).catch((err) => console.error('Error opening link:', err));
    };

    const renderContactItem = (icon, label, value, url) => (
        <View style={styles.contactItem}>
            <Feather name={icon} size={24} color="#4A5568" style={styles.icon} />
            <View style={styles.contactInfo}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value || 'Not provided'}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => copyToClipboard(value)}>
                    <Feather name="copy" size={24} color="#4A5568" style={styles.actionIcon} />
                </TouchableOpacity>
                {url && (
                    <TouchableOpacity onPress={() => openLink(url)}>
                        <Feather name="external-link" size={24} color="#4A5568" style={styles.actionIcon} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Club Contact Information</Text>
            </View>

            <View style={styles.contactList}>
                {renderContactItem('linkedin', 'LinkedIn', contact.linkedin, contact.linkedin)}
                {renderContactItem('twitter', 'Twitter', contact.twitter, contact.twitter)}
                {renderContactItem('github', 'GitHub', contact.github, contact.github)}
                {renderContactItem('instagram', 'Instagram', contact.instagram, contact.instagram)}
                {renderContactItem('facebook', 'Facebook', contact.facebook, contact.facebook)}
                {renderContactItem('youtube', 'YouTube', contact.youtube, contact.youtube)}
                {renderContactItem('mail', 'Email', contact.email, `mailto:${contact.email}`)}
                {renderContactItem('phone', 'Phone Number', contact.phoneNumber, `tel:${contact.phoneNumber}`)}
                {renderContactItem('globe', 'Website', contact.website, contact.website)}
            </View>

            <TouchableOpacity 
                style={styles.editButton}
                onPress={() => {
                    setTempContact({ ...contact }); // Set tempContact to current contact data
                    setModalVisible(true);
                }}
            >
                <Feather name="edit-2" size={24} color="white" style={styles.editIcon} />
                <Text style={styles.editButtonText}>Edit Contact Info</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Edit Contact Information</Text>
                            {['linkedin', 'twitter', 'github', 'instagram', 'facebook', 'youtube', 'email', 'phoneNumber', 'website'].map((key) => (
                                <View key={key} style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={`Enter ${key}`}
                                        value={tempContact[key]}
                                        onChangeText={(text) => setTempContact({ ...tempContact, [key]: text })}
                                        keyboardType={key === 'email' ? 'email-address' : key === 'phoneNumber' ? 'phone-pad' : 'default'}
                                    />
                                </View>
                            ))}
                            
                            <TouchableOpacity 
                                style={styles.updateButton}
                                onPress={handleUpdatePress}
                            >
                                <Feather name="check" size={24} color="white" style={styles.updateIcon} />
                                <Text style={styles.updateButtonText}>Update</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Feather name="x" size={24} color="white" style={styles.cancelIcon} />
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    header: {
        padding: 20,
        backgroundColor: '#003366',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    contactList: {
        padding: 16,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    icon: {
        marginRight: 15,
    },
    contactInfo: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    value: {
        fontSize: 14,
        color: '#777777',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionIcon: {
        marginLeft: 10,
    },
    editButton: {
        backgroundColor: '#00509E',
        paddingVertical: 15,
        borderRadius: 25,
        margin: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        height: '70%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
    },
    updateButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    updateButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        padding: 15,
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    updateIcon: {
        marginRight: 10,
    },
    cancelIcon: {
        marginRight: 10,
    },
});

export default ContactInfoScreen;
