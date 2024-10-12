const Event = require('../../Models/EventModel'); // Ensure the Event model is imported
const getAllPastEvents = async (req, res) => {
  try {
    // Fetch all events where the event date is less than the current date
    const today = new Date();
    // console.log("today",today);
    const pastEvents = await Event.find({ eventDate: { $lt: today } });
    // If no past events are found, send an appropriate response
    // if (pastEvents.length === 0) {
    //   return res.status(404).json({ message: 'No past events found.' ,success:true});
    // }

    // Respond with the list of past events
    res.status(200).json({
      success: true,
      data: pastEvents
    });
  } catch (err) {
    // Handle any errors that occur during the database query
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error. Could not retrieve past events.'
    });
  }
};

module.exports = getAllPastEvents;
