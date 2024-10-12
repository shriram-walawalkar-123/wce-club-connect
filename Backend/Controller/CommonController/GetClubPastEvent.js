const Event = require('../../Models/EventModel'); // Ensure the Event model is imported

const getClubPastEvent = async (req, res) => {
    try {
        const { clubId } = req.body; // Destructure clubId from the request body

        // Get the current date
        const currentDate = new Date();

        // Find events where eventDate is less than or equal to the current date and matches the clubId
        const pastEvents = await Event.find({
            clubId: clubId,
            eventDate: { $lte: currentDate } // $lte operator checks for less than or equal to
        }).sort({ eventDate: -1 }); // Sort events by eventDate in descending order

        // Send the past events in the response
        return res.status(200).json({
            success: true,
            message: 'Past events retrieved successfully',
            data: pastEvents,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving past events',
        });
    }
};

module.exports = {
    getClubPastEvent,
};
