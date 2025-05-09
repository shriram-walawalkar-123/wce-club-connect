const bcrypt = require("bcryptjs");
const User = require("../Models/SignUpModel");
const Id = require('../Models/ClubIdModel');

const signup = async (req, res) => {
    try {
        const { name, email, clubName, collegeName, clubId, password, role, profilepic } = req.body;
        // console.log(req.body);
        
        // Basic input validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password, and role are required fields",
            });
        }

        // Role-specific validation
        if (role === "club") {
            if (!clubName || clubName.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: "Club name is required for club role",
                });
            }
            if (!clubId || clubId.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: "Club ID is required for club role",
                });
            }

            // Check if the clubId is present in the Id model
            const clubIdExists = await Id.findOne({ clubId });
            if (!clubIdExists) {
                return res.status(400).json({
                    success: false,
                    message: "Club ID does not exist",
                });
            }
        } else if (role === "student") {
            if (!collegeName || collegeName.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: "College name is required for student role",
                });
            }
        }

        // Check if the user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // Hash the password
        let hashPassword;
        try {
            hashPassword = await bcrypt.hash(password, 10);
        } catch (err) {
            console.error("Hashing error:", err);
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
                error: err.message,
            });
        }

        // Create a new user object
        const newUser = new User({
            name,
            email,
            clubName: role === "club" ? clubName : undefined,
            clubId: role === "club" ? clubId : undefined,
            collegeName: role === "general" || role === "student" ? collegeName : undefined,
            password: hashPassword,
            profilepic,
            role,
        });

        // Save the new user to the database
        await newUser.save();

        // Respond with success
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        console.error("Error during signup:", err);
        return res.status(500).json({
            success: false,
            message: "Server error during signup",
            error: err.message,
        });
    }
};

module.exports = signup;
