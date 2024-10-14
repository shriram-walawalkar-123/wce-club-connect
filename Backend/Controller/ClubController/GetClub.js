const Club = require("../../Models/ClubModel");

const getClub = async (req, res) => {
  try {
    const clubId = req?.user?.id; // Assuming the user object contains the club's ID
    // Find the club by its ID
    let club = await Club.findOne({ clubId });
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // Return the gallery data
    return res.status(200).json({
      success: true,
      message: "Gallery retrieved successfully",
      club:club, // Assuming 'gallary' contains the images
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = getClub;
