const Booked = require("../models/booked");
const Event_class = require("../models/event");

exports.postbooked = async (req, res, next) => {
  const { eventId, customerId} = req.body;

  const event = await Event_class.findById(eventId);
  console.log("Event found  for booking:",event);
  const booked = new Booked({
    eventId: eventId,        // ← Yeh add karo!
    customerId: customerId,
    hostId: event.hostId,
    shopName: event.shopName,
  });

  await booked.save();
  console.log("Booking saved: ", booked);

  res.redirect('/');
};