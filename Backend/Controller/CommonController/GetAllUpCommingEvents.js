const Event = require('../../Models/EventModel'); // Ensure the Event model is imported

const getAllUpCommingEvents = async (req, res) => {
  try {
    // Fetch all events where the event date is greater than or equal to the current date
    const today = new Date();
    const upcomingEvents = await Event.find({ eventDate: { $gte: today } });
    // If no events found, send an appropriate response
    if (!upcomingEvents || upcomingEvents.length === 0) {
      return res.status(404).json({ success: false, message: 'No upcoming events found.' });
    }

    // Respond with the list of upcoming events
    res.status(200).json({
      success: true,
      data: upcomingEvents
    });
  } catch (err) {
    // Handle any errors that occur during the database query
    console.error('Error fetching upcoming events:', err); // More descriptive error logging
    res.status(500).json({
      success: false,
      message: 'Server error. Could not retrieve upcoming events.'
    });
  }
};

module.exports = getAllUpCommingEvents;
