const User = require("../Models/SignUpModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("this is backend side",email,password);
        // Check if email and password are provided
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide email for login",
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Please provide password for login",
            });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exist. Please sign up.",
            });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Create JWT payload including role
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role // Include the role in the payload
        };
        const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "1h" });

        // Set the token as a cookie and respond with success
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }).status(200).json({
            success: true,
            message: "Login Successful",
            token: token, // Include token in response
            role: user.role, // Optionally include role in response
            error: false,
        });
        
    } catch (err) {
        console.error("Sign In Error: ", err); // Added logging for debugging
        return res.status(500).json({
            message: "Failed to sign in, please try again",
            error: err.message || err,
            success: false,
        });
    }
};

module.exports = login;
