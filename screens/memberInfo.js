import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

const MemberInfo = () => {
    const members = useSelector(state => state.club.members); // Get all members from Redux store

    const renderItem = ({ item }) => (
        <View style={styles.memberCard}>
            <Text style={styles.title}>{item.name}</Text>
            <View style={styles.row}>
                <Text style={styles.label}>Role</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{item.role}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{item.email}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Instagram</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{item.instagram}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>LinkedIn</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{item.linkedin}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Slogan</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{item.slogan}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{item.description}</Text>
            </View>
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
        backgroundColor:'#e7e7c7',
    },
    header: {
        marginTop: 90,
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
        textAlign: 'center', // Align the label to the right
        // paddingRight: 5, // Add some space between the label and the colon
        fontWeight: 'bold',
        // marginLeft:100,
    },
    colon: {
        marginRight:-40,
        marginLeft:-40,
        color: 'lightblue',
        width: 10, // Fixed width for the colon
        textAlign: 'center',
        // marginLeft:-60,
    },
    value: {
        color: 'lightblue',
        flex: 1,
        textAlign: 'center', // Align the value to the left
        paddingLeft: 5, // Add some space between the colon and the value
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
