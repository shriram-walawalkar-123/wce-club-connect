const ClubMember = require("../../Models/ClubMemberModel");

const clubMemberDelete = async (req, res) => {
    try {
        const { MemberId } = req.body; // No need for optional chaining here
        const id = req?.user?.id; // No need for optional chaining here
        console.log("memberId",MemberId,"clubId",id);
        const member = await ClubMember.findOne({ clubId: id, _id:MemberId });
        if (!member) {
            return res.status(404).json({ // 404 is a better status code for 'not found'
                success: false,
                message: "Member does not exist. Please try again.",
            });
        }

        await member.deleteOne(); // Await the deletion to complete

        return res.status(200).json({
            success: true,
            error: false,
            message: "Club member deleted successfully!",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error during clubMemberDelete",
            error: err.message,
        });
    }
};

module.exports = clubMemberDelete;
