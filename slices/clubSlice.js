import { createSlice } from '@reduxjs/toolkit';

// Initial state with empty fields since no data is available initially
const initialState = {
    clubId: null,          // Club ID to be set after first login
    clubName: '',          // Club name, will be updated by the admin
    department: '',        // Department the club belongs to
    establishmentYear: '', // Year the club was established
    typeOfClub: '',        // Type of the club
    specialization: '',    // Specialization of the club
    clubLogo: '',          // Club logo (URL)
    motto: '',             // Club motto
    objectives: '',        // Club objectives
    facultyAdvisors: [],
    clubInfo: null,
    members: [],           // Club members, initially an empty array
    gallery: [],           // Club gallery, can store images as an array
    services: [],          // Club services, initially empty
    upcomingEvents: [],    // Store upcoming events
    pastEvents: [],        // Store past events
    contactInfo: {         // Updated to store multiple contact fields
        phone: '',         // Club phone number
        linkedin: '',      // LinkedIn link
        instagram: '',     // Instagram link
        email: '',         // Email address of the club
        facebook: '',
        twitter: '',
        github: '',
    },
};

// Helper function to move past events
const isEventPast = (eventDate) => {
    const today = new Date();
    return new Date(eventDate) < today;
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
        // Action to update department
        updateDepartment: (state, action) => {
            state.department = action.payload;
        },
        // Action to update establishment year
        updateEstablishmentYear: (state, action) => {
            state.establishmentYear = action.payload;
        },
        // Action to update type of club
        updateTypeOfClub: (state, action) => {
            state.typeOfClub = action.payload;
        },
        // Action to update specialization
        updateSpecialization: (state, action) => {
            state.specialization = action.payload;
        },
        // Action to update club logo
        updateClubLogo: (state, action) => {
            state.clubLogo = action.payload;
        },
        // Action to update motto
        updateMotto: (state, action) => {
            state.motto = action.payload;
        },
        // Action to update objectives
        updateObjectives: (state, action) => {
            state.objectives = action.payload;
        },
        // Action to update faculty advisor details
        updateFacultyAdvisor: (state, action) => {
            state.facultyAdvisors = { ...state.facultyAdvisors, ...action.payload };
        },
        // Action to update club members
        updateMembers: (state, action) => {
            state.members = action.payload;
        },
        addClubMember: (state, action) => {
            state.members.push(action.payload); // Add new member
        },
        updateClubMember: (state, action) => {
            const index = state.members.findIndex(member => member.id === action.payload.id);
            if (index !== -1) {
                state.members[index] = action.payload; // Update the member
            }
        },
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
        // Add event to upcomingEvents
        addUpcomingEvent: (state, action) => {
            state.upcomingEvents.push(action.payload);
        },
        // Update event in upcomingEvents
        updateUpcomingEvent: (state, action) => {
            const index = state.upcomingEvents.findIndex(event => event.id === action.payload.id);
            if (index !== -1) {
                state.upcomingEvents[index] = action.payload;
            }
        },
        // Move event to pastEvents
        moveEventToPast: (state, action) => {
            const event = state.upcomingEvents.find(event => event.id === action.payload);
            if (event && isEventPast(event.date)) {
                state.upcomingEvents = state.upcomingEvents.filter(event => event.id !== action.payload);
                state.pastEvents.push(event);
            }
        },
        // Action to update club contact information
        updateContactInfo: (state, action) => {
            const { field, value } = action.payload;
            if (state.contactInfo.hasOwnProperty(field)) {
                state.contactInfo[field] = value;
            }
        },
        setClubInfo: (state, action) => {
            state.clubInfo = action.payload;
        },
        updateClubInfo: (state, action) => {
            state.clubInfo = { ...state.clubInfo, ...action.payload };
        },
    },
});

// Selectors
export const selectClub = (state) => state.club;
export const selectClubDescription = (state) => state.club.description;
export const selectClubMembers = (state) => state.club.members;
export const selectClubId = (state) => state.club.clubId;
export const selectContactInfo = (state) => state.club.contactInfo;
export const selectGallery = (state) => state.club.gallery;
export const selectUpcomingEvents = (state) => state.club.upcomingEvents;
export const selectPastEvents = (state) => state.club.pastEvents;
export const { setClubInfo, updateClubInfo } = clubSlice.actions;

// Export the actions so they can be dispatched from components
export const {
    setClubId,
    updateClubName,
    updateDepartment,
    updateEstablishmentYear,
    updateTypeOfClub,
    updateSpecialization,
    updateClubLogo,
    updateMotto,
    updateObjectives,
    updateFacultyAdvisor,
    updateMembers,
    updateClubMember,
    addClubMember,
    removeClubMember,
    updateGallery,
    updateServices,
    updateEvents,
    addUpcomingEvent,
    updateUpcomingEvent,
    moveEventToPast,
    updateContactInfo,
} = clubSlice.actions;

// Export the reducer to be used in the store
export default clubSlice.reducer;
