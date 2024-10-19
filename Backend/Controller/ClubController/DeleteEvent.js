const Event = require('../../Models/EventModel');

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.body; // Get eventId from the request body
    if (!eventId) {
      return res.status(400).json({ success: false, message: "Event ID is required." });
    }

    const deletedEvent = await Event.findByIdAndDelete({_id:eventId}); // Find the event by ID and delete it

    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    return res.status(200).json({ success: true, message: "Event deleted successfully.", deletedEvent });
  } catch (err) {
    console.error("Error deleting event:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

module.exports = { deleteEvent };
