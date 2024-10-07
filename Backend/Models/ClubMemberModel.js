const mongoose=require("mongoose");
// Define the Club Member schema as a separate model
const clubMemberSchema = new mongoose.Schema({
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Assuming you have a Club model
        required: true
    },
    profilepic: {
        type: String, // URL or file path for the profile picture
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String, // Role in the club (e.g., President, Vice President)
        required: true
    },
    email: {
        type: String,
        trim: true
    },
    instagram: {
        type: String, // Instagram profile URL
    },
    linkedin: {
        type: String, // LinkedIn profile URL
    },
    slogan: {
        type: String, // Personal slogan or motto
    },
    description: {
        type: String, // Short bio or description of the member
    }
});

// Create Club Member model
const ClubMember = mongoose.model("ClubMember", clubMemberSchema);

module.exports = ClubMember;
