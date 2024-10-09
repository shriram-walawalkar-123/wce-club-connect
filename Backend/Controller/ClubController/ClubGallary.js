const Club = require("../../Models/ClubModel");

const clubGallery = async (req, res) => {
  try {
    const clubId = req.user.id; // Assuming the user object contains the club's ID
    const { eventPhoto } = req.body; // Expecting eventPhoto as an array of URLs
    console.log("eventPhoto", eventPhoto); // Log the incoming event photos for debugging

    // Find the club by its ID
    let club = await Club.findOne({ clubId });
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // Ensure eventPhoto is an array
    if (Array.isArray(eventPhoto)) {
      // Directly push the new photo URLs into the gallery
      const photos = eventPhoto.map(photoUrl => {
        return {
          url: photoUrl, // Assign the photo URL directly from the incoming data
        };
      });

      club.gallary.push(...photos);

    } else {
      // Handle case where it's a single photo
      club.gallary.push({
        url: eventPhoto, // Directly use eventPhoto as URL
      });
    }

    // Save the updated club document
    await club.save();

    return res.status(200).json({
      success: true,
      message: "Gallery updated/added successfully",
      club,
    });
  } catch (err) {
    console.error("Error updating gallery:", err); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = clubGallery;
