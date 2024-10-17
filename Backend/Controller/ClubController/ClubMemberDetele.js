const ClubMember = require("../../Models/ClubMemberModel");

const clubMemberDelete = async (req, res) => {
    try {
        const { MemberId } = req?.body; // Extract MemberId from request body
        const clubId = req?.user.id; // Extract clubId from authenticated user
        // console.log("MemberId:", MemberId, "ClubId:", clubId);
        // Check if the member exists in the club
        const member = await ClubMember.findOne({ clubId, _id: MemberId });
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member does not exist. Please try again.",
            });
        }

        // Delete the member
        await member.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Club member deleted successfully!",
        });
    } catch (err) {
        console.error("Error during clubMemberDelete:", err); // Log the error for debugging
        return res.status(500).json({
            success: false,
            message: "Server error during clubMemberDelete",
            error: err.message,
        });
    }
};

module.exports = clubMemberDelete;
