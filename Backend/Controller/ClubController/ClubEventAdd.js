const Event=require("../../Models/EventModel")
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

    // Extract main event and sub-event data from the request body
    // const {
    //   mainEvent,  // Destructuring the main event object
    //   subEvents   // Directly using the subEvents array from req.body
    // } = req.body;

    // Extract the individual main event fields from the nested 'mainEvent' object
    const {
      clubName,
      eventName,
      eventPoster,
      description,
      eventDate,

      sponsors,
      subEvents
    } = req.body;
    console.log("backend",eventName)
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

    console.log("subodh",savedEvent);


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
