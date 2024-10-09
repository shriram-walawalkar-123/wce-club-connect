const Event = require('../../Models/EventModel'); // Assuming your Event model is in the 'models' folder

const clubEventAdd = async (req, res) => {
  try {
    // Extract clubId from the authenticated user's data
    const clubId = req?.user?.id;

    // Check if clubId exists
    if (!clubId) {
      return res.status(400).json({
        success: false,
        message: 'Club ID is missing in the request.'
      });
    }

    // Extract the rest of the event data from the request body
    const {
      clubName,
      eventName,
      eventPoster,
      description,
      eventDate,
      sponsors,
      subEvents
    } = req.body;

    // Create a new event object
    const newEvent = new Event({
      clubId,             // Use the clubId from the authenticated user
      clubName,
      eventName,
      eventPoster,
      description,
      eventDate,
      sponsors,
      subEvents
    });

    // Save the new event to the database
    const savedEvent = await newEvent.save();

    // Send success response
    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: savedEvent
    });
  } catch (err) {
    console.error('Error creating event:', err);

    // Send error response
    return res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: err.message
    });
  }
};

module.exports = {
  clubEventAdd
};
