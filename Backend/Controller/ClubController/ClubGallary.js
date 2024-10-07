const Club = require("../../Models/ClubModel");

const clubGallery = async (req, res) => {
    try {
      const { eventPhoto, projectShowCase, achievement } = req.body;
      const clubId = req.user.id; // Assuming the user object contains the club's ID
  
      // Find the club by ID
      let club = await Club.findOne({clubId});
      if (!club) {
        return res.status(404).json({
          success: false,
          message: "Club not found",
        });
      }
  
      // Update gallery fields
      club.eventPhoto = eventPhoto || club.eventPhoto;
      club.projectShowCase = projectShowCase || club.projectShowCase;
      club.achievement = achievement || club.achievement;
  
      await club.save();
  
      return res.status(200).json({
        success: true,
        message: "Gallery updated/added successfully",
        club,
      });
  
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  };
  
  module.exports = clubGallery;
  