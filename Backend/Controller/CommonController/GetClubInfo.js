const Club = require("../../Models/ClubModel"); // Import the Club model
const getClubInfo = async (req, res) => {
    try {
        const { clubId } = req.body; // Destructure clubId from the request body
        console.log("clubId",clubId);
        // Validate the clubId
        if (!clubId) {
            return res.status(400).json({
                success: false,
                message: "clubId is required.",
            });
        }

        // Find the club by clubId in the Club model
        const club = await Club.findOne({ clubId: clubId });

        // Check if the club was found
        if (!club) {
            return res.status(404).json({
                success: false,
                message: "Club not found.",
            });
        }

        // Send the club data in the response
        return res.status(200).json({
            success: true,
            message: "Club fetched successfully.",
            data: club, // Include the club data in the response
        });
    } catch (err) {
        // Handle errors
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the club.",
            error: err.message, // Optionally include the error message
        });
    }
};

module.exports=getClubInfo;