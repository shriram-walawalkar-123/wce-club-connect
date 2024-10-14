import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
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

const MemberInfo = ({ route }) => {
    const { member } = route.params;

    if (!member || member.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.header}>No Members Available</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Club Members</Text>
            <FlatList
                data={member}
                keyExtractor={item => item._id.toString()}
                contentContainerStyle={{ padding: width * 0.03 }}
                renderItem={({ item }) => (
                    <LinearGradient
                    colors={['#E6F3FF', '#B0C4DE', '#778899']}
                        style={styles.memberCard}
                    >
                        <Image source={{ uri: item.profilepic }} style={styles.image} />
                        <Text style={styles.title}>{item.name}</Text>
                        <View style={styles.row}>
                            <MaterialIcons name="person-outline" size={scaleFontSize(24)} color="#091057" />
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
                            <Entypo name="quote" size={scaleFontSize(24)} color="#091057" />
                            <Text style={styles.value}>{item.slogan}</Text>
                        </View>
                        <View style={styles.descriptionRow}>
                            <MaterialIcons name="info-outline" size={scaleFontSize(24)} color="#3C3D37" />
                            <Text style={styles.descriptionValue}>{item.description}</Text>
                        </View>
                    </LinearGradient>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#7077A1',
        elevation: 6, // Higher elevation for Android
        shadowColor: '#000000', // Dark shadow color
        shadowOffset: { width: 0, height: 4 }, // Larger shadow offset for a bolder shadow
        shadowOpacity: 0.5, // Stronger shadow opacity for more contrast
        shadowRadius: 6, // Wider shadow spread for a more diffused look
    },
    header: {
        marginTop: height * 0.02,
        fontSize: scaleFontSize(28),
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: height * 0.02,
        color: '#003366',
    },
    memberCard: {
        marginBottom: height * 0.025,
        padding: width * 0.05,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        alignItems: 'center',
    },
    title: {
        color: '#000000',
        fontSize: scaleFontSize(26),
        fontWeight: 'bold',
        marginBottom: height * 0.02,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.015,
        width: '100%',
    },
    descriptionRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: height * 0.015,
        width: '100%',
    },
    value: {
        color: '#000000', 
        flex: 1,
        textAlign: 'left', 
        paddingLeft: 15,
        fontSize: scaleFontSize(18),
        fontWeight: '600',
    },
    descriptionValue: {
        color: '#000000', 
        flex: 1,
        textAlign: 'left', 
        paddingLeft: 15,
        fontSize: scaleFontSize(16),
        fontWeight: '500',
        lineHeight: scaleFontSize(22),
    },
    image: {
        width: width * 0.35,
        height: width * 0.35,
        borderRadius: width * 0.175,
        marginTop: height * 0.01,
        marginBottom: height * 0.02,
        borderWidth: 3,
        borderColor: '#ffffff',
    },
});

export default MemberInfo;