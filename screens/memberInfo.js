import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

const MemberInfo = () => {
    const members = useSelector(state => state.club.members); // Get all members from Redux store

    const renderItem = ({ item }) => (
        <View style={styles.memberCard}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>Role: {item.role}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Instagram: {item.instagram}</Text>
            <Text>LinkedIn: {item.linkedin}</Text>
            <Text>Slogan: {item.slogan}</Text>
            <Text>Description: {item.description}</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Club Members</Text>
            <FlatList
                data={members}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 20 }}
            />
        </View>
    );
};

// Styles for the MemberInfo component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    memberCard: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 10,
    },
});

export default MemberInfo;
