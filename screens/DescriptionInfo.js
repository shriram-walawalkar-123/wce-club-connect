import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const DescriptionInfo = ({ route }) => {
    const { clubData } = route.params; // Get the clubData from route params
    // console.log("club data",clubData);
    // Check if the club object is not null or undefined
    if (!clubData) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No club information available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Club Logo */}
            <View style={styles.infoRow}>
                <Text style={styles.label}>Club Logo:</Text>
                {clubData.clubLogo ? (
                    <Image source={{ uri: clubData.clubLogo }} style={styles.logo} />
                ) : (
                    <Text style={styles.label}>No logo available</Text>
                )}
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Club Name:</Text>
                <Text style={styles.infoText}>{clubData.clubName}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Department:</Text>
                <Text style={styles.infoText}>{clubData.department}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Establishment Year:</Text>
                <Text style={styles.infoText}>{clubData.establishmentYear}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Type of Club:</Text>
                <Text style={styles.infoText}>{clubData.typeOfClub}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Specialization:</Text>
                <Text style={styles.infoText}>{clubData.specialization}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Motto:</Text>
                <Text style={styles.infoText}>{clubData.motto}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Objectives:</Text>
                <Text style={styles.infoText}>{clubData.objectives}</Text>
            </View>

            {/* Faculty Advisors */}
            <Text style={styles.title}>Faculty Advisors:</Text>
            {clubData.facultyAdvisors && clubData.facultyAdvisors.length > 0 ? (
                clubData.facultyAdvisors.map((advisor, index) => (
                    <View key={index} style={styles.infoRow}>
                        <View style={styles.infoColumn}>
                            <Text style={styles.label}>Advisor {index + 1} Name:</Text>
                            <Text style={styles.infoText}>{advisor.name}</Text>
                            <Text style={styles.label}>Contact:</Text>
                            <Text style={styles.infoText}>{advisor.contactDetails}</Text>
                            {advisor.image && (
                                <Image source={{ uri: advisor.image }} style={styles.advisorImage} />
                            )}
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.label}>No faculty advisors available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'flex-start', // Align everything to the left
        backgroundColor: '#e7e7c7',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    infoColumn: {
        flexDirection: 'column',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        width: 150, // Adjust width for consistent spacing between label and info
    },
    infoText: {
        color: '#003366',
        fontSize: 16,
        flexShrink: 1,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 10,
        resizeMode: 'contain',
        borderColor: 'black',
        borderWidth: 1,
    },
    advisorImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        resizeMode: 'contain',
        marginTop: 10,
    },
});

export default DescriptionInfo;
