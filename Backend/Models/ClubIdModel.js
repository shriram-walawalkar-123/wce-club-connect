const mongoose = require('mongoose');

const IdSchema = new mongoose.Schema({
  clubName:{
    type:String,
    required: true, // Fixed typo: changed "require" to "required"
  },
  clubId: {
    type: String,
  },
  email: {
    type: String,
    required: true, // Fixed typo: changed "require" to "required"
  }
});

module.exports = mongoose.model('Id', IdSchema);
