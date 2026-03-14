const Event_class = require('../models/event')
const Booked = require('../models/booked');
const fs = require("fs");
// global module
const Groq = require('groq-sdk');
const { start } = require('repl');


exports.getAddevent = (req, res, next) => {
  res.render("host/edit-event", {
    pageTitle: "Add event to decobnb",
    currentPage: "addevent",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
    event: {}  
  });
};


exports.getEditevent = (req, res, next) => {
  const eventId = req.params.eventId;
  const editing = req.query.editing === "true";

  Event_class.findById(eventId).then((event) => {
    if (!event) {
      //console.log("event not found for editing.");
      return res.redirect("/host/host-event-list");
    }

    //console.log(eventId, editing, event);
    res.render("host/edit-event", {
      event: event,
      pageTitle: "Edit your event",
      currentPage: "host-events",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHostevents = (req, res, next) => {
  Event_class.find().then((registeredevents) => {
    res.render("host/host-event-list", {
      registeredevents: registeredevents,
      pageTitle: "Host events List",
      currentPage: "host-events",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.postAddevent = (req, res, next) => {
  const { EventName, price, location, rating, description, shopName } = req.body;
  //console.log(EventName, price, location, rating, description, shopName);
  //console.log(req.files);

  if (!req.files['photo']) {
    return res.status(422).send("No image provided");
  }

  const photo = req.files['photo'][0].path;
  const video = req.files['video'] ? req.files['video'][0].path : null;
  const   hostId=req.session.user._id;

  const event = new Event_class({
    EventName,
    price,
    location,
    rating,
    photo,
    video,
    shopName,
    description,
    hostId,
  

  });
  event.save().then(() => {
    console.log("event Saved successfully");
  });

  res.redirect("/host/host-event-list");
};


exports.postEditevent = (req, res, next) => {
  const { id, EventName, price, location, rating, description, shopName } = req.body;
  
  Event_class.findById(id)
    .then((event) => {
      event.EventName = EventName;
      event.price = price;
      event.location = location;
      event.rating = rating;
      event.description = description;
      event.shopName = shopName;

      if (req.files['photo']) {
        fs.unlink(event.photo, (err) => {
          if (err) console.log("Error while deleting file ", err);
        });
        event.photo = req.files['photo'][0].path;
      }

      if (req.files['video']) {
        event.video = req.files['video'][0].path;
      }

      event.save()
        .then((result) => {
          console.log("event updated ", result);
        })
        .catch((err) => {
          console.log("Error while updating ", err);
        });
        
      res.redirect("/host/host-event-list");
    })
    .catch((err) => {
      console.log("Error while finding event ", err);
    });
};

exports.postDeleteevent = (req, res, next) => {
  const eventId = req.params.eventId;
  console.log("Came to delete ", eventId);
  Event_class.findByIdAndDelete(eventId)
    .then(() => {
      res.redirect("/host/host-event-list");
    })
    .catch((error) => {
      console.log("Error while deleting ", error);
    });
};

exports.getorders = async (req, res) => {
  try {
    const hostId = req.session.user._id;

    const bookings = await Booked.find({ hostId: hostId })
      .populate('eventId')
      .populate('customerId');

    // Mobile number fix karo
    bookings.forEach(booking => {
      if(booking.customerId) {
        const obj = booking.customerId.toObject();
        booking.customerId.mobileNumber = obj['  mobileNumber'] || obj[' mobileNumber'] || obj.mobileNumber;
      }
    });

    res.render("host/orders", { 
      bookings,
      pageTitle: "Host events List",
      currentPage: "host-events",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });

  } catch (err) {
    console.error(err);
  }
};
exports.suggestPrice = async (req, res) => {
  try {
    const { EventName } = req.body;
  
 const groq = new Groq({ apiKey: ' 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' });
    
    const result = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: `I am an event decoration service provider in India. Suggest a price range in INR for this type of event: "${EventName}". Give only price range like ₹5000 - ₹15000, nothing else.`
        }
      ]
    });
    
    const price = result.choices[0].message.content;
    console.log(price);npm 
    res.json({ price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};