const mongoose = require("mongoose");
const ClubMember = require("../../Models/ClubMemberModel");

const clubMemberAdd = async (req, res) => {
    try {
        const { profilepic, name, role, email, instagram, linkedin, slogan, description } = req.body;
        
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
        let clubMember = await ClubMember.findOne({ clubId });
        if(clubMember){
            clubMember.profilepic=profilepic,
            clubMember.name=name
            clubMember.role=role,
            clubMember.instagram=instagram
            clubMember.linkedin=linkedin
            clubMember.slogan=slogan,
            clubMember.description=description
            await clubMember.save();

            return res.status(200).json({
                success: true,
                message: "Club Member details updated successfully",
                data: clubMember
            });
        }else{
            const newMember = new ClubMember({
                profilepic,
                name,
                role,
                email,
                instagram,
                linkedin,
                slogan,
                description,
                clubId // Add the clubId to the new member object
            });
    
            // Save the new member
            await newMember.save();
    
            return res.status(201).json({
                success: true,
                message: "Club member created successfully",
                data: newMember
            });
        }
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error during clubMemberAdd",
            error: err.message
        });
    }
};

module.exports = clubMemberAdd;
