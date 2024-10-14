const Id = require('../../Models/ClubIdModel');

// Function to generate a random alphanumeric string of length 6
const generateId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let clubId = '';
  for (let i = 0; i < 6; i++) {
    clubId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return clubId;
};

const clubIdCreate = async (req, res) => {
  try {
    const { email,clubName } = req.body;
    if(!email || !clubName){
        return res.status(400).json({
            message: 'email and clubName require',
            success: false,
          });
    }
    // Check if the email already exists in the database
    const existingId = await Id.findOne({ email });
    if (existingId) {
      return res.status(400).json({
        message: 'Club ID has already been generated for this email',
        data: existingId,
        success: false,
      });
    }

    // Generate the clubId
    const clubId = generateId();

    // Create the Id object with generated clubId and email
    const newId = new Id({
      clubId,
      email,
      clubName
    });

    // Save the Id to the database
    await newId.save();

    // Send the response with the newly created Id
    res.status(201).json({
      message: 'Club ID generated successfully',
      data: newId,
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

module.exports = { clubIdCreate };
