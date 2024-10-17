const Event = require('../../Models/EventModel');

const clubEventEdit = async (req, res) => {
    try {
        console.log("i am suboo", req.body);
        const { eventId, clubName, eventName, formUrl, eventPoster, description, eventDate, sponsors, subEvents } = req.body;
        const clubId = req.user.id;
        // Ensure the eventId is provided
        if (!eventId
        ) {
            return res.status(400).json({ message: 'Event ID is required' });
        }

        // Find the event to be updated and ensure the club has permission to edit it
        const event = await Event.findOne({
            _id: eventId
            , clubId
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found or you do not have permission to edit it' });
        }
        // console.log("clubname is a :", clubName);

        // Build the updated data, retaining previous values if a field is not provided
        const updatedData = {
            clubName: clubName || event.clubName,
            eventName: eventName || event.eventName,
            formUrl: formUrl || event.formUrl,
            eventPoster: eventPoster || event.eventPoster,
            description: description || event.description,
            eventDate: eventDate ? new Date(eventDate) : event.eventDate,
            sponsors: sponsors || event.sponsors,
            subEvents:subEvents || event.subEvents
        };
        
        // Update the event with the new data
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
