const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  EventName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  photo: String,
  description: String,
});

// eventSchema.pre('findOneAndDelete', async function(next) {
//   console.log('Came to pre hook while deleting a event');
//   const eventId = this.getQuery()._id;
//   await favourite.deleteMany({EventId: eventId});
//   next();
// });

module.exports = mongoose.model("Event_class", eventSchema);
