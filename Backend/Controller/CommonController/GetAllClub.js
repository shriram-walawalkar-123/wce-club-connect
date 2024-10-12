const User=require('../../Models/SignUpModel')

const getAllClub = async (req, res) => {
    try {
      const clubs = await User.find({ role: 'club' }); // Fetch all users with the role of 'club'
  
      if (clubs.length === 0) {
        return res.status(404).json({ success: false, message: 'No clubs found' });
      }
  
      return res.status(200).json({ success: true, clubs });
    } catch (err) {
      console.error('Error fetching clubs:', err);
      return res.status(500).json({ success: false, message: 'An error occurred while retrieving clubs' });
    }
  };

  module.exports = getAllClub;

  