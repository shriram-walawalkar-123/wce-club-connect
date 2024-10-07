// src/components/DescriptionInfo.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';

const DescriptionInfo = () => {
    const club = useSelector((state) => state.club.clubInfo); // Access club information from Redux store

    // Check if the club object is not null or undefined
    if (!club) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No club information available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Club Logo */}
            <Text>Club Logo:</Text>
            {club.clubLogo ? (
                <Image source={{ uri: club.clubLogo }} style={styles.logo} />
            ) : (
                <Text>No logo available</Text> // Fallback message if no logo is present
            )}

            <Text style={styles.title}>{club.clubName}</Text>
            <Text style={styles.label}>Department: {club.department}</Text>
            <Text style={styles.label}>Establishment Year: {club.establishmentYear}</Text>
            <Text style={styles.label}>Type of Club: {club.typeOfClub}</Text>
            <Text style={styles.label}>Specialization: {club.specialization}</Text>
            <Text style={styles.label}>Motto: {club.motto}</Text>
            <Text style={styles.label}>Objectives: {club.objectives}</Text>

            <Text style={styles.title}>Faculty Advisors:</Text>
            {club.facultyAdvisors.map((advisor, index) => (
                <View key={index}>
                    <Text style={styles.label}>Advisor {index + 1} Name: {advisor.name}</Text>
                    <Text style={styles.label}>Contact: {advisor.contactDetails}</Text>
                    {advisor.image && (
                        <Image source={{ uri: advisor.image }} style={styles.advisorImage} />
                    )}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center', // Center the content
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
        borderRadius: 10,
        resizeMode: 'contain',
        alignSelf: 'center',
        borderColor: 'black', // Optional: Add border to visualize
        borderWidth: 1, // Optional: Add border width for visualization
    },
    advisorImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
        borderRadius: 10,
        resizeMode: 'contain',
    },
});

export default DescriptionInfo;
