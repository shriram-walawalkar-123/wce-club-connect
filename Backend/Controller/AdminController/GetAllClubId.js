const Id = require('../../Models/ClubIdModel');
const bcrypt = require('bcryptjs');

const getAllClubId = async (req, res) => {
  try {
    const allId = await Id.find().sort({ createdAt: -1 }); // Sort by createdAt field in descending order
    res.status(200).json({
      message: 'All club IDs retrieved successfully',
      data: allId,
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error',
      error: err.message,
      success: false,
    });
  }
};

module.exports = getAllClubId;
