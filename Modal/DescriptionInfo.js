import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const DescriptionInfo = ({ clubData, visible, onClose }) => {
    if (!clubData) {
        return (
            <Modal transparent visible={visible} animationType="slide">
                <View style={styles.container}>
                    <TouchableOpacity style={styles.overlay} onPress={onClose} />
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>No club information available.</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButtonContainer}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    const renderInfoRow = (icon, label, value) => (
        <View style={styles.infoRow}>
            <FontAwesome5 name={icon} size={24} color={styles.icon.color} style={styles.icon} />
            <View style={styles.infoTextContainer}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.infoText}>{value}</Text>
            </View>
        </View>
    );

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.container}>
                <TouchableOpacity style={styles.overlay} onPress={onClose} />
                <View style={styles.modalContent}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <LinearGradient
                            colors={['#4e545c', '#000401']} // Gunmetal Gray to Jet Black
                            style={styles.header}
                        >
                            <View style={styles.logoContainer}>
                                {clubData.clubLogo ? (
                                    <Image source={{ uri: clubData.clubLogo }} style={styles.logo} />
                                ) : (
                                    <View style={styles.placeholderLogo}>
                                        <FontAwesome5 name="university" size={60} color="#e5e8e8" />
                                    </View>
                                )}
                            </View>
                            <Text style={styles.title}>{clubData.clubName}</Text>
                        </LinearGradient>

                        <View style={styles.infoContainer}>
                            {renderInfoRow('building', 'Department', clubData.department)}
                            {renderInfoRow('calendar-alt', 'Establishment Year', clubData.establishmentYear)}
                            {renderInfoRow('tag', 'Type of Club', clubData.typeOfClub)}
                            {renderInfoRow('star', 'Specialization', clubData.specialization)}
                            {renderInfoRow('quote-left', 'Motto', clubData.motto)}
                            {renderInfoRow('bullseye', 'Objectives', clubData.objectives)}
                        </View>

                        <Text style={styles.sectionTitle}>Faculty Advisors</Text>
                        {clubData.facultyAdvisor && clubData.facultyAdvisor.length > 0 ? (
                            clubData.facultyAdvisor.map((advisor, index) => (
                                <View key={index} style={styles.advisorCard}>
                                    <LinearGradient
                                        colors={['#000401', '#4e545c']} // Jet Black to Gunmetal Gray
                                        style={styles.advisorGradient}
                                    >
                                        {advisor.image ? (
                                            <Image source={{ uri: advisor.image }} style={styles.advisorImage} />
                                        ) : (
                                            <View style={styles.placeholderImage}>
                                                <FontAwesome5 name="user" size={40} color="#e5e8e8" />
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
                    <TouchableOpacity onPress={onClose} style={styles.closeButtonContainer}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker overlay
        justifyContent: 'flex-end', // Open from the bottom
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        backgroundColor: '#000000', // Solid black background
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: width,
        maxHeight: '80%',
        paddingBottom: 20,
        borderWidth: 1,
        borderColor: '#8d9797', // Pewter
    },
    header: {
        alignItems: 'center',
        padding: 30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#000000', // Solid black background
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: '#4e545c', // Gunmetal Gray
        borderRadius: 25,
    },
    logo: {
        width: width * 0.45,
        height: width * 0.45,
        borderRadius: width * 0.225,
        resizeMode: 'cover',
    },
    placeholderLogo: {
        width: width * 0.45,
        height: width * 0.45,
        borderRadius: width * 0.225,
        backgroundColor: '#8d9797', // Pewter
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff', // White
        textAlign: 'center',
    },
    infoContainer: {
        marginHorizontal: 15,
        marginTop: 20,
        borderRadius: 20,
        backgroundColor: '#000000', // Solid black background
        padding: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#8d9797', // Pewter
    },
    icon: {
        marginRight: 20,
        width: 30,
        color: '#ffffff', // White
    },
    infoTextContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold', // Bold white headings
        color: '#ffffff', // White
    },
    infoText: {
        fontSize: 18,
        color: '#ffffff', // White
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff', // White
        marginTop: 30,
        textAlign: 'center',
    },
    advisorCard: {
        marginHorizontal: 15,
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    advisorGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    advisorImage: {
        width: width * 0.22,
        height: width * 0.22,
        borderRadius: width * 0.11,
        marginRight: 20,
        borderWidth: 2,
        borderColor: '#8d9797', // Pewter
    },
    placeholderImage: {
        width: width * 0.22,
        height: width * 0.22,
        borderRadius: width * 0.11,
        backgroundColor: '#8d9797', // Pewter
        justifyContent: 'center',
        alignItems: 'center',
    },
    advisorInfo: {
        flex: 1,
    },
    advisorName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff', // White
    },
    advisorContact: {
        fontSize: 16,
        color: '#ffffff', // White
    },
    noAdvisor: {
        fontSize: 16,
        color: '#ffffff', // White
        textAlign: 'center',
        marginVertical: 20,
    },
    closeButtonContainer: {
        backgroundColor: '#8d9797', // Pewter
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#ffffff', // White
        fontWeight: 'bold', // Bold close button text
    },
});


export default DescriptionInfo;
