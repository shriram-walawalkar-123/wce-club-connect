const Event = require('../../Models/EventModel'); // Ensure the Event model is imported

const getClubUpcomingEvent = async (req, res) => {
    try {
        const { clubId } = req.body; // Destructure clubId from the request body

        // Get the current date
        const currentDate = new Date();

        // Find events where eventDate is greater than the current date and matches the clubId
        const upcomingEvents = await Event.find({
            clubId: clubId,
            eventDate: { $gt: currentDate } // $gt operator checks for greater than
        }).sort({ eventDate: 1 }); // Sort events by eventDate in ascending order

        // Send the upcoming events in the response
        return res.status(200).json({
            success: true,
            message: 'Upcoming events retrieved successfully',
            data: upcomingEvents,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving upcoming events',
        });
    }
};

module.exports =getClubUpcomingEvent;

