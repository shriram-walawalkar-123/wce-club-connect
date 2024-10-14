import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DescriptionInfo = ({ route }) => {
    const { clubData } = route.params;

    if (!clubData) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No club information available.</Text>
            </View>
        );
    }

    const renderInfoRow = (icon, label, value) => (
        <View style={styles.infoRow}>
            <FontAwesome5 name={icon} size={20} color="#4a4a4a" style={styles.icon} />
            <Text style={styles.label}>{label}:</Text>
            <Text style={styles.infoText}>{value}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={['#ADD8E6', '#36454F']} // Gradient color for the header
                style={styles.header}
            >
                <View style={styles.logoContainer}>
                    {clubData.clubLogo ? (
                        <Image source={{ uri: clubData.clubLogo }} style={styles.logo} />
                    ) : (
                        <View style={styles.placeholderLogo}>
                            <FontAwesome5 name="university" size={50} color="#4a4a4a" />
                        </View>
                    )}
                </View>
                <Text style={styles.title}>{clubData.clubName}</Text>
            </LinearGradient>

            <LinearGradient
                colors={['#ADD8E6', '#ADD8E6']} // Using the same color for a uniform look
                style={styles.infoContainer}
            >
                {renderInfoRow('building', 'Department', clubData.department)}
                {renderInfoRow('calendar-alt', 'Establishment Year', clubData.establishmentYear)}
                {renderInfoRow('tag', 'Type of Club', clubData.typeOfClub)}
                {renderInfoRow('star', 'Specialization', clubData.specialization)}
                {renderInfoRow('quote-left', 'Motto', clubData.motto)}
                {renderInfoRow('bullseye', 'Objectives', clubData.objectives)}
            </LinearGradient>

            <Text style={styles.sectionTitle}>Faculty Advisors</Text>
            {clubData.facultyAdvisor && clubData.facultyAdvisor.length > 0 ? (
                clubData.facultyAdvisor.map((advisor, index) => (
                    <View key={index} style={styles.advisorCard}>
                        <LinearGradient
                            colors={['#ADD8E6', '#36454F']}
                            style={styles.advisorGradient}
                        >
                            {advisor.image ? (
                                <Image source={{ uri: advisor.image }} style={styles.advisorImage} />
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <FontAwesome5 name="user" size={30} color="#4a4a4a" />
                                </View>
                            )}
                            <View style={styles.advisorInfo}>
                                <Text style={styles.advisorName}>{advisor.name}</Text>
                                <Text style={styles.advisorContact}>{advisor.contactDetails}</Text>
                            </View>
                        </LinearGradient>
                    </View>
                ))
            ) : (
                <Text style={styles.noAdvisor}>No faculty advisors available</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 30, // Increased padding for better spacing
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        margin: 20, // Add margin below header to separate it from content
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10, // Margin below logo for spacing
        padding: 10, // Padding around logo for a better layout
        backgroundColor: '#ffffff', // White background for logo section
        borderRadius: 20, // Rounded corners for the logo container
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    logo: {
        width: width * 0.4,
        height: width * 0.4,
        borderRadius: width * 0.2,
        resizeMode: 'cover',
        borderWidth: 3,
    },
    placeholderLogo: {
        width: width * 0.4,
        height: width * 0.4,
        borderRadius: width * 0.2,
        backgroundColor: '#ADD8E6', // Same vibe color
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#ffffff',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
    },
    infoContainer: {
        margin: 15,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    icon: {
        marginRight: 15,
        width: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4a4a4a',
        width: 150,
    },
    infoText: {
        fontSize: 16,
        color: '#333333',
        flex: 1,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 25,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    advisorCard: {
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    advisorGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    advisorImage: {
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: width * 0.1,
        marginRight: 15,
    },
    placeholderImage: {
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: width * 0.1,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    advisorInfo: {
        flex: 1,
    },
    advisorName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 5,
    },
    advisorContact: {
        fontSize: 16,
        color: '#4a4a4a',
    },
    noAdvisor: {
        fontSize: 16,
        color: '#666666',
        fontStyle: 'italic',
        paddingHorizontal: 20,
        textAlign: 'center',
    },
});

export default DescriptionInfo;
