const mongoose = require("mongoose");

// Define the Club schema
const clubSchema = new mongoose.Schema({
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Assuming you have a Club model
        required: true
    },
    clubName: {
        type: String,
        required: true
    },
    department: {
        type: String,
    },
    establishmentYear: {
        type: String,
    },
    typeOfClub: {
        type: String,
        enum: ['Tech', 'Non-Tech'],
        required: true
    },
    specialization: {
        type: String,
    },
    clubLogo: {
        type: String, // URL or file path for the logo
        required: true
    },
    motto: {
        type: String,
    },
    objectives: [{
        type: String,
    }],
    facultyAdvisor: [{
        name: {
            type: String,
        },
        contactDetails: {
            type: String,
        },
        image: {
            type: String,  // URL or path to the faculty advisor's image
        }
    }],
    // social media link
    linkedin: { type: String },
    twitter: { type: String },
    github:{type:String},
    instagram: { type: String },
    facebook: { type: String },
    youtube: { type: String },
    email: {type: String},
    phoneNumber: {type: String},
    website: { type: String},

    //gallary
    eventPhoto:[{type:String}],
    projectShowCase:[{type:String}],
    achievement:[{type:String}],
});
// Create the Club model
const Club = mongoose.model("Club", clubSchema);
module.exports = Club;
