const mongoose = require("mongoose");
const ClubMember = require("../../Models/ClubMemberModel");

const clubMemberUpdate = async (req, res) => {
    try {
        const { _id, profilepic, name, role, email, instagram, linkedin, slogan, description } = req?.body;
        // console.log("profilepic",profilepic);
        const clubId=req?.user?.clubId
        // Validate member ID and required fields
        if (!_id|| !name || !role || !email) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields, including the member ID."
            });
        }

        // Check if the member exists
        const clubMember = await ClubMember.findById({_id:_id,clubId:clubId});
        if (!clubMember) {
            return res.status(404).json({
                success: false,
                message: "Club member not found."
            });
        }

        // Update the club member's details
        clubMember.profilepic = profilepic;
        clubMember.name = name;
        clubMember.role = role;
        clubMember.email = email;
        clubMember.instagram = instagram;
        clubMember.linkedin = linkedin;
        clubMember.slogan = slogan;
        clubMember.description = description;

        // Save the updated member
        await clubMember.save();
        // console.log("clubMember",clubMember);
        return res.status(200).json({
            success: true,
            message: "Club member updated successfully",
            data: clubMember
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error during clubMemberUpdate",
            error: err.message
        });
    }
};

module.exports = clubMemberUpdate;
