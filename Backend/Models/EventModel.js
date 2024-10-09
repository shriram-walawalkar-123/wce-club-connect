const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
  clubName: { type: String },
  eventName: { type: String },
  eventPoster: { type: String },
  description: { type: String },
  eventDate: { type: Date },
  sponsors: [{
    sponsorType: { type: String },
    image: { type: String },
  }],
  subEvents: [{
    subEventName: { type: String },
    entryFee: { type: Number },
    description: { type: String },
    date: { type: Date },
    time: { type: String },
    venue: { type: String },
    contacts: [{
      name: { type: String },
      phone: { type: String },
    }],
    rulebookPDF: { type: String },
    rounds: [{
      roundTime: { type: String },
      description: { type: [String] },
    }],
  }],
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
