const Event = require("../../Models/EventModel");

const clubEventAdd = async (req, res) => {
  try {
    const clubId = req?.user?.id;

    if (!clubId) {
      return res.status(400).json({
        success: false,
        message: 'Club ID is missing in the request.'
      });
    }

    const {
      clubName,
      eventName,
      eventPoster,
      description,
      eventDate,
      sponsors,
      subEvents
    } = req.body;

    // Process sponsors to ensure image is a string
    const processedSponsors = sponsors.map(sponsor => ({
      ...sponsor,
      image: sponsor.image?.secure_url || sponsor.image
    }));

    const newEvent = new Event({
      clubId,
      clubName,
      eventName,
      eventPoster,
      description,
      eventDate,
      sponsors: processedSponsors,
      subEvents
    });
    console.log("subevemt backend",subEvents);
    const savedEvent = await newEvent.save();

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: savedEvent
    });
  } catch (err) {
    console.error('Error creating event:', err);
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