const Event = require('../../Models/EventModel'); // Ensure the Event model is imported

const getClubEvent = async (req, res) => {
    try {
        const clubId = req.user.id; // Get the clubId from the authenticated user

        // Fetch all events associated with the clubId
        const events = await Event.find({ clubId }).sort({ createdAt: -1 }); // -1 for descending order

        // Check if any events were found
        if (events.length === 0) {
            return res.status(404).json({ message: 'No events found for this club.' });
        }

        // Return the list of events
        return res.status(200).json({
            success:true,
            error:false,
            message: 'Events retrieved successfully',
            events
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while retrieving events' });
    }
};

module.exports = getClubEvent;
