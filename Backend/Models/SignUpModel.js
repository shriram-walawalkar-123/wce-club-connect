const mongoose = require('mongoose');

// User signup schema with timestamps
const userSignUpSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Removes extra spaces
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures unique email
        trim: true,
    },
    clubName:{
        type: String,
        trim: true // Removes extra spaces
    },
    CollegeName:{
        type: String,
        trim: true // Removes extra spaces
    },
    clubId:{
        type: String,
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Ensures password is at least 6 characters long
    },
    role: {
        type: String,
        enum: ['Student', 'club','admin'], // Restricts role to 'user' or 'admin'
        default: 'Student' // Default role is 'user'
    }
}, { timestamps: true }); // Add timestamps option

module.exports = mongoose.model('User', userSignUpSchema);
