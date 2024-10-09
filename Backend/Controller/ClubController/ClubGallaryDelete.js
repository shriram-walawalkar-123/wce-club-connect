const Club = require("../../Models/ClubModel"); // Import the Club model

const deleteGalleryImage = async (req, res) => {
  try {
    const { imageId } = req.body; // Expecting `imageId` in the request body
    console.log("Received imageId:", imageId);

    const clubId = req.user.id; // Assuming the user object contains the club's ID

    // Find the club by ID (replace clubId field with the correct one if needed)
    let club = await Club.findOne({ clubId });
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // Ensure the gallery exists
    if (!club.gallary || !club.gallary.length) {
      return res.status(400).json({
        success: false,
        message: "Gallery is empty or does not exist",
      });
    }

    // Remove the specified image from the gallery array by its _id
    club.gallary = club.gallary.filter(img => img._id.toString() !== imageId);

    // Save the updated club document
    await club.save();

    return res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully",
      club,
    });

  } catch (err) {
    console.error("Error during deleteGalleryImage:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during deleteGalleryImage",
      error: err.message,
    });
  }
};

module.exports = deleteGalleryImage;
