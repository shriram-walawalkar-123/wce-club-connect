const Event = require('../../Models/EventModel'); // Ensure the Event model is properly imported

const clubEventEdit = async (req, res) => {
    try {
        const { eventId } = req.body; // Get the eventId from the request body
        const clubId = req.user.id; // Get the clubId from the authenticated user
        console.log("eventId",eventId);
        // Check if eventId is provided
        if (!eventId) {
            return res.status(400).json({ message: 'Event ID is required' });
        }

        // Fetch the event to ensure the user has permission to edit it
        const event = await Event.findOne({ _id: eventId, clubId });

        if (!event) {
            return res.status(404).json({ message: 'Event not found or you do not have permission to edit it' });
        }

        // Create an updatedData object to hold the new values from the request
        const updatedData = { ...req.body };

        // Update the event with the data received in the request body
        const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedData, { new: true });

        return res.status(200).json({
            message: 'Event updated successfully',
            event: updatedEvent
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while updating the event' });
    }
};

module.exports = clubEventEdit;
