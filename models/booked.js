const mongoose = require('mongoose');

const bookedSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event_class',          // ← Event se link
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    
  },
  shopName: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Booked', bookedSchema);