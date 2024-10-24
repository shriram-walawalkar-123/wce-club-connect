import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, Entypo, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const scaleFontSize = (size) => {
    const screenWidth = width;
    if (screenWidth > 400) {
        return size * 1.3; // Increased scaling factor for larger screens
    }
    return size; // Keep original size for smaller screens
};

const MemberInfo = ({ member, isVisible, onClose }) => {
    if (!member || member.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.header}>No Members Available</Text>
            </SafeAreaView>
        );
    }

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.overlay} onPress={onClose} />
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.modalContent}>
                        <View style={styles.handleContainer}>
                            <View style={styles.handle} />
                        </View>
                        <Text style={styles.header}>Club Members</Text>
                        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                            {member.map((item) => (
                                <LinearGradient
                                    key={item._id.toString()}
                                    colors={['#E6F3FF', '#B0C4DE', '#778899']}
                                    style={styles.memberCard}
                                >
                                    <Image source={{ uri: item.profilepic }} style={styles.image} />
                                    <Text style={styles.title}>{item.name}</Text>
                                    <View style={styles.row}>
                                        <MaterialIcons name="person-outline" size={scaleFontSize(24)} color="#000401" />
                                        <Text style={styles.value}>{item.role}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <MaterialIcons name="email" size={scaleFontSize(24)} color="#F95454" />
                                        <Text style={styles.value}>{item.email}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <FontAwesome name="instagram" size={scaleFontSize(24)} color="#E4405F" />
                                        <Text style={styles.value}>{item.instagram}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <FontAwesome name="linkedin-square" size={scaleFontSize(24)} color="#0077B5" />
                                        <Text style={styles.value}>{item.linkedin}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Entypo name="quote" size={scaleFontSize(24)} color="#000401" />
                                        <Text style={styles.value}>{item.slogan}</Text>
                                    </View>
                                    <View style={styles.descriptionRow}>
                                        <MaterialIcons name="info-outline" size={scaleFontSize(24)} color="#3C3D37" />
                                        <Text style={styles.descriptionValue}>{item.description}</Text>
                                    </View>
                                </LinearGradient>
                            ))}
                        </ScrollView>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    safeArea: {
        backgroundColor: '#000000',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '72.4%',
        marginBottom:150,
    },
    modalContent: {
        backgroundColor: '#000000',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#E5E8E8',
        borderRadius: 3,
    },
    scrollViewContent: {
        paddingHorizontal: width * 0.05,
        paddingBottom: 20,
    },
    header: {
        fontSize: scaleFontSize(26),
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#E5E8E8',
        marginVertical: height * 0.02,
    },
    memberCard: {
        padding: width * 0.05,
        borderRadius: 15,
        marginBottom: height * 0.025,
        elevation: 3,
        alignItems: 'center',
    },
    title: {
        color: '#000401',
        fontSize: scaleFontSize(24),
        fontWeight: 'bold',
        marginBottom: height * 0.01,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.015,
        width: '100%',
    },
    value: {
        color: '#000401',
        flex: 1,
        paddingLeft: 15,
        fontSize: scaleFontSize(18),
        fontWeight: '600',
    },
    descriptionRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: height * 0.015,
        width: '100%',
    },
    descriptionValue: {
        color: '#000401',
        flex: 1,
        paddingLeft: 15,
        fontSize: scaleFontSize(16),
        fontWeight: '500',
        lineHeight: scaleFontSize(22),
    },
    image: {
        width: width * 0.35,
        height: width * 0.35,
        borderRadius: width * 0.175,
        marginBottom: height * 0.02,
        borderWidth: 3,
        borderColor: '#000401',
    },
    closeButton: {
        backgroundColor: '#F95454',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        marginHorizontal: width * 0.05,
        marginTop: height * 0.02,
    },
    closeButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: scaleFontSize(18),
    },
});

export default MemberInfo;