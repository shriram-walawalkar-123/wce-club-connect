const Club = require("../../Models/ClubModel");

const getClubGallery = async (req, res) => {
  try {
    const clubId = req?.user?.id; // Assuming the user object contains the club's ID
    // console.log("clubId",clubId);
    // Log the clubId for debugging
    // console.log("clubId", clubId);

    // Find the club by its ID
    let club = await Club.findOne({ clubId });
    console.log("club is if galary",club);
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
      gallery: club.gallary, // Assuming 'gallary' contains the images
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = getClubGallery;
