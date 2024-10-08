import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const ShowAllUpdatedMembers = ({ allMembers }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>All Members:</Text>
            <ScrollView contentContainerStyle={styles.listContainer}>
                {allMembers.map((item, index) => (
                    <View key={index} style={styles.memberCard}>
                        <Text>Name: {item.name}</Text>
                        <Text>Role: {item.role}</Text>
                        <Text>Email: {item.email}</Text>
                        <Text>Instagram: {item.instagram}</Text>
                        <Text>LinkedIn: {item.linkedin}</Text>
                        <Text>Slogan: {item.slogan}</Text>
                        <Text>Description: {item.description}</Text>
                        {item.profilepic && <Image source={{ uri: item.profilepic }} style={styles.image} />}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    memberCard: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginVertical: 10,
    },
    listContainer: {
        paddingVertical: 10,
    },
});

export default ShowAllUpdatedMembers;
