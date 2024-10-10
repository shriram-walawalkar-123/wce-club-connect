const Club = require("../../Models/ClubModel"); // Import the Club model

const clubSocialMedia = async (req, res) => {
  try {
    const { linkedin, twitter, github, instagram, facebook, youtube, email, phoneNumber, website } = req.body;
    const clubId = req.user.id; // Assuming the user object contains the club's ID
    console.log("clubId",clubId);
    // Check if the club exists in the database
    let club = await Club.findOne({clubId });
    if (!club) {
      // If the club is not found, return an error response
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // Update the social media links only
    club.linkedin = linkedin || club.linkedin;
    club.twitter = twitter || club.twitter;
    club.github = github || club.github;
    club.instagram = instagram || club.instagram;
    club.facebook = facebook || club.facebook;
    club.youtube = youtube || club.youtube;
    club.email = email || club.email;
    club.phoneNumber = phoneNumber || club.phoneNumber;
    club.website = website || club.website;
    
    await club.save(); // Save the updated club details

    return res.status(200).json({
      success: true,
      message: "Social media links updated/added successfully",
      club,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error during clubSocialMedia",
      error: err.message,
    });
  }
};

module.exports = clubSocialMedia;
