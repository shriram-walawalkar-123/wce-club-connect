const Club = require("../../Models/ClubModel"); // Import the Club model

const deleteGalleryImage = async (req, res) => {
  try {
    const { imageType, imageUrl } = req.body; // Expecting `imageType` and `imageUrl` in the request body
    const clubId = req.user.id; // Assuming the user object contains the club's ID

    // Find the club by ID
    let club = await Club.findOne({clubId });
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // Remove the specified image based on image type
    if (imageType === 'eventPhoto') {
      club.eventPhoto = club.eventPhoto.filter(img => img !== imageUrl);
    } else if (imageType === 'projectShowCase') {
      club.projectShowCase = club.projectShowCase.filter(img => img !== imageUrl);
    } else if (imageType === 'achievement') {
      club.achievement = club.achievement.filter(img => img !== imageUrl);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid image type provided",
      });
    }

    // Save the updated club details
    await club.save();

    return res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully",
      club,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error during deleteGalleryImage",
      error: err.message,
    });
  }
};

module.exports = deleteGalleryImage;
