// src/screens/UpdateClubInfoScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import ClubInfoFormModal from './ClubInfoFormModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SummaryApi from '../backendRoutes';
import { Ionicons } from '@expo/vector-icons';

const UpdateClubInfoScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [formState, setFormState] = useState({
        clubName: '',
        department: '',
        establishmentYear: '',
        typeOfClub: '',
        specialization: '',
        clubLogo: '',
        motto: '',
        objectives: '',
        facultyAdvisor: [],
    });

    const fetchClubInfo = async () => {
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
            if (data.success) {
                setFormState(data.club);
            } else {
                Alert.alert('Error', data.message || 'Failed to fetch club info.');
            }
        } catch (error) {
            console.error('Error fetching club info:', error);
            Alert.alert('Error', 'Failed to fetch club info. Please try again.');
        }
    };

    useEffect(() => {
        fetchClubInfo();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {formState.clubLogo ? (
                    <Image
                        source={{ uri: formState.clubLogo }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoPlaceholderText}>No Club Logo Available</Text>
                    </View>
                )}
                <Text style={styles.title}>Current Club Information</Text>

                {/* Club Information Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Club Details</Text>
                    {renderInfoRow("people-outline", "Club Name", formState.clubName)}
                    {renderInfoRow("school-outline", "Department", formState.department)}
                    {renderInfoRow("calendar-outline", "Establishment Year", formState.establishmentYear)}
                    {renderInfoRow("construct-outline", "Type of Club", formState.typeOfClub)}
                    {renderInfoRow("code-slash", "Specialization", formState.specialization)}
                </View>

                {/* Motto and Objectives Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Motto & Objectives</Text>
                    {renderInfoRow("flag-outline", "Motto", formState.motto)}
                    {renderInfoRow("document-text-outline", "Objectives", formState.objectives)}
                </View>

                {/* Faculty Advisors Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle} >Faculty Advisors</Text>

                    {formState.facultyAdvisor?.map((advisor, index) => (
                        <View key={index} style={styles.advisorContainer}>
                            <Image
                                source={typeof advisor.image === 'string' ? { uri: advisor.image } : advisor.image}  // Check if image is remote or local
                                style={{ height: 96, width: 96}}  // Replace `clubName` with proper style
                            />
                            <Text style={styles.value}>
                                - {advisor.name ? advisor.name : 'Unknown'} ({advisor.contactDetails ? advisor.contactDetails : 'No contact details'})
                            </Text>
                        </View>
                    ))}
                </View>


                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Update Club Info</Text>
                </TouchableOpacity>
            </ScrollView>
            <ClubInfoFormModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                formData={formState}
                fetchClubInfo={fetchClubInfo}
            />
        </View>
    );
};

const renderInfoRow = (iconName, label, value) => (
    <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={24} color="#fff" />
        </View>
        <Text style={styles.label}>{label}: <Text style={styles.value}>{value || 'N/A'}</Text></Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    logo: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    logoPlaceholder: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    logoPlaceholderText: {
        color: '#888',
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
        flex: 1,
    },
    value: {
        fontSize: 16,
        fontWeight: '400',
        color: '#555',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#FF9800',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default UpdateClubInfoScreen;
