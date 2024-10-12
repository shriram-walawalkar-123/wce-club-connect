
const ClubMember = require("../../Models/ClubMemberModel");

const getClubMemberCommon = async (req, res) => {
    try {
        // Assuming the user object contains the club's ID
        const {clubId}=req.body;
        // Validate clubId
        if (!clubId) {
            return res.status(400).json({
                success: false,
                message: "Club ID not found in request."
            });
        }

        // Fetch all club members with the matching clubId
        const members = await ClubMember.find({ clubId: clubId });

        // Check if any members were found
        if (!members || members.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No members found for this club."
            });
        }

        // Send the list of club members as a response
        return res.status(200).json({
            success: true,
            message: "Club members retrieved successfully",
            data: members
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error during getClubMember",
            error: err.message,
        });
    }
};

module.exports = getClubMemberCommon;
