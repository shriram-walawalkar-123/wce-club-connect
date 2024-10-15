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
    formUrl:{tyep:String},
    description: { type: String },
    date: { type: Date },
    time: { type: String },
    venue: { type: String },
    contacts: [{
      name: { type: String },
      phone: { type: Number },
    }],
    rulebookPDF:{
      uri: { type: String }, // URI field for the PDF location
      name: { type: String }, // Name field for the PDF file
    },
    rounds: [{
      roundTime: { type: String },
      description: { type: [String] }, // Array of strings for round descriptions
    }],
  }],
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
