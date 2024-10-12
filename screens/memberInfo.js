import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MemberInfo = ({ route }) => {
    const { member } = route.params; // Extracting member data from route params
    // console.log("member", member); // Log the received member data

    // Handle case when member is null or empty
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
                data={member} // Use member passed from params
                keyExtractor={item => item._id.toString()} // Ensure id is a string
                contentContainerStyle={{ padding: 20 }}
                renderItem={({ item }) => (
                    <View style={styles.memberCard}>
                        <Image source={{ uri: item.profilepic }} style={styles.image} />
                        <Text style={styles.title}>{item.name}</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Role:</Text>
                            <Text style={styles.value}>{item.role}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.value}>{item.email}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Instagram:</Text>
                            <Text style={styles.value}>{item.instagram}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>LinkedIn:</Text>
                            <Text style={styles.value}>{item.linkedin}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Slogan:</Text>
                            <Text style={styles.value}>{item.slogan}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Description:</Text>
                            <Text style={styles.value}>{item.description}</Text>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

// Styles for the MemberInfo component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7e7c7',
    },
    header: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#003366',
    },
    memberCard: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#07768c',
        borderRadius: 8,
        elevation: 2,
        alignItems: 'center',
    },
    title: {
        color: 'lightblue',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        width: '100%',
    },
    label: {
        color: 'lightblue',
        flex: 1,
        textAlign: 'left', // Align the label to the left
        fontWeight: 'bold',
    },
    value: {
        color: 'lightblue',
        flex: 2,
        textAlign: 'left', // Align the value to the left
        paddingLeft: 5,
        fontWeight: 'bold',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 10,
    },
});

export default MemberInfo;
