const mongoose = require("mongoose");
const ClubMember = require("../../Models/ClubMemberModel");

const clubMemberAdd = async (req, res) => {
    console.log("req body of member", req.body);
    try {
        const { profilepic, name, role, email, instagram, linkedin, slogan, description } = req?.body;
        console.log("res bosy",req?.body);
        // Validate required fields
        if (!profilepic || !name || !role || !email) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields."
            });
        }

        // Get clubId from the request user
        const id = req?.user?.id;
        const clubId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;
        console.log("clubId", clubId);

        // Create a new club member
        const newMember = new ClubMember({
            profilepic: profilepic,
            name,
            role,
            email,
            instagram,
            linkedin,
            slogan,
            description,
            clubId
        });

        // Save the new member
        await newMember.save();

        return res.status(201).json({
            success: true,
            message: "Club member created successfully",
            data: newMember
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error during clubMemberAdd",
            error: err.message
        });
    }
};

module.exports = clubMemberAdd;
