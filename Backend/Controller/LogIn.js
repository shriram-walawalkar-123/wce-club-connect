const User = require("../Models/SignUpModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res) => {
    try {
        const { email, password,role } = req.body;
        // console.log("this is backend side",email,password);
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
        if(!role){
            return res.status(400).json({
                success: false,
                message: "Please provide role for login",
            });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        console.log("user data is in login",user);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exist. Please sign up.",
            });
        }
        if(user.role!=role){
            return res.status(400).json({
                success: false,
                message: "you are not a valid user, please check role",
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
            role: user.role,
            profilepic:user.profilepic,
            clubId:user.clubId,
            id:user._id,
        };
        // console.log("userId",user.clubId);
        const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "1d" });

        // Set the token as a cookie and respond with success
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }).status(200).json({
            success: true,
            message: "Login Successful",
            token: token, // Include token in response
            email: user.email,
            role: user.role,
            profilepic:user.profilepic,
            name:user.name,
            id:user._id,
            clubId:user.clubId,
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