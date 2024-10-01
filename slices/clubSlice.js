import { createSlice } from '@reduxjs/toolkit';

// Initial state with empty fields since no data is available initially
const initialState = {
    clubId: null,          // Club ID to be set after first login
    clubName: '',          // Club name, will be updated by the admin
    description: '',       // Club description, initially empty
    members: [],           // Club members, initially an empty array
    gallery: [],           // Club gallery, can store images as array
    services: [],          // Club services, initially empty
    events: [],            // Club events, will store upcoming/past events
    contactInfo: '',       // Club contact information, initially empty
};

// Create a slice of the store
const clubSlice = createSlice({
    name: 'club',
    initialState,
    reducers: {
        // Action to set the club ID
        setClubId: (state, action) => {
            state.clubId = action.payload;
        },
        // Action to update club name
        updateClubName: (state, action) => {
            state.clubName = action.payload;
        },
        // Action to update club description
        updateClubDescription: (state, action) => {
            state.description = action.payload;
        },
        // Action to update club members
        updateMembers: (state, action) => {
            state.members = action.payload;
        },
        // Action to update a specific club member
        updateClubMember: (state, action) => {
            const { id, newDetails } = action.payload;
            const index = state.members.findIndex(member => member.id === id);
            if (index !== -1) {
                state.members[index] = { ...state.members[index], ...newDetails };
            }
        },
        // Action to add a new member
        addClubMember: (state, action) => {
            state.members.push(action.payload);
        },
        // Action to remove a member
        removeClubMember: (state, action) => {
            state.members = state.members.filter(member => member.id !== action.payload);
        },
        // Action to update club gallery
        updateGallery: (state, action) => {
            state.gallery = action.payload;
        },
        // Action to update club services
        updateServices: (state, action) => {
            state.services = action.payload;
        },
        // Action to update club events
        updateEvents: (state, action) => {
            state.events = action.payload;
        },
        // Action to update club contact information
        updateContactInfo: (state, action) => {
            state.contactInfo = action.payload;
        },
    },
});

// Selectors
export const selectClubDescription = (state) => state.club.description;
export const selectClubMembers = (state) => state.club.members;
// Add this selector to your existing selectors
export const selectClubId = (state) => state.club.clubId;

// Export the actions so they can be dispatched from components
export const {
    setClubId,
    updateClubName,
    updateClubDescription,
    updateMembers,
    updateClubMember,
    addClubMember,
    removeClubMember,
    updateGallery,
    updateServices,
    updateEvents,
    updateContactInfo,
} = clubSlice.actions;

// Export the reducer to be used in the store
export default clubSlice.reducer;
