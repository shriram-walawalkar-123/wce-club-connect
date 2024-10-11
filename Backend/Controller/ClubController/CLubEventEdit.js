const Event = require('../../Models/EventModel');

const clubEventEdit = async (req, res) => {
    try {
        console.log("i am suboo",req.body);
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
        console.log("clubname is a :", clubName);

        // Build the updated data, retaining previous values if a field is not provided
        const updatedData = {
            clubName: clubName || event.clubName,
            eventName: eventName || event.eventName,
            formUrl: formUrl || event.formUrl,
            eventPoster: eventPoster || event.eventPoster,
            description: description || event.description,
            eventDate: eventDate ? new Date(eventDate) : event.eventDate,
            sponsors: sponsors || event.sponsors,
            subEvents: subEvents ? subEvents.map((subEvent, index) => ({
                subEventName: subEvent.subEventName || event.subEvents[index]?.subEventName,
                entryFee: subEvent.entryFee || event.subEvents[index]?.entryFee,
                description: subEvent.description || event.subEvents[index]?.description,
                date: subEvent.date ? new Date(subEvent.date) : event.subEvents[index]?.date,
                time: subEvent.time ? new Date(subEvent.time) : event.subEvents[index]?.time,
                venue: subEvent.venue || event.subEvents[index]?.venue,
                contacts: subEvent.contacts ? subEvent.contacts.map((contact, contactIndex) => ({
                    name: contact.name || event.subEvents[index]?.contacts[contactIndex]?.name,
                    phone: contact.phone || event.subEvents[index]?.contacts[contactIndex]?.phone
                })) : event.subEvents[index]?.contacts,
                rulebookPDF: Array.isArray(subEvent.rulebookPDF) ? subEvent.rulebookPDF.map((pdf, pdfIndex) => ({
                    name: pdf.name || event.subEvents[index]?.rulebookPDF[pdfIndex]?.name,
                    uri: pdf.uri || event.subEvents[index]?.rulebookPDF[pdfIndex]?.uri
                })) : event.subEvents[index]?.rulebookPDF || [],
                rounds: subEvent.rounds ? subEvent.rounds.map((round, roundIndex) => ({
                    name: round.name || event.subEvents[index]?.rounds[roundIndex]?.name,
                    description: round.description ? round.description.map((desc, descIndex) => ({
                        desc: desc || event.subEvents[index]?.rounds[roundIndex]?.description[descIndex]
                    })) : event.subEvents[index]?.rounds[roundIndex]?.description
                })) : event.subEvents[index]?.rounds || []
            })) : event.subEvents
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
