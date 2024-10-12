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
    collegeName:{
        type: String,
        trim: true // Removes extra spaces
    },
    clubId:{
        type: String,
    },
    password: {
        type: String,
        required: false, // Password is not required for Google users
    },
    role: {
        type: String,
        enum: ['student', 'club','admin'], // Restricts role to 'user' or 'admin'
        default: 'student' // Default role is 'user'
    }
}, { timestamps: true }); // Add timestamps option

module.exports = mongoose.model('User', userSignUpSchema);
