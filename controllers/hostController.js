const Event_class = require('../models/event')
const fs = require("fs");

exports.getAddevent = (req, res, next) => {
  res.render("host/edit-event", {
    pageTitle: "Add event to decobnb",
    currentPage: "addevent",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};



exports.getEditevent = (req, res, next) => {
  const eventId = req.params.eventId;
  const editing = req.query.editing === "true";

  Event_class.findById(eventId).then((event) => {
    if (!event) {
      console.log("event not found for editing.");
      return res.redirect("/host/host-event-list");
    }

    console.log(eventId, editing, event);
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
  const { EventName, price, location, rating, description } = req.body;
  console.log(EventName, price, location, rating, description);
  console.log(req.file);

  if (!req.file) {
    return res.status(422).send("No image provided");
  }

  const photo = req.file.path;

 const event = new Event_class({
    EventName,
    price,
    location,
    rating,
    photo,
    description,
  });
  event.save().then(() => {
    console.log("event Saved successfully");
  });

  res.redirect("/host/host-event-list");
};

exports.postEditevent = (req, res, next) => {
  const { id, EventName, price, location, rating, description } =
    req.body;;
  Event_class.findById(id)
    .then((event) => {
      event.EventName = EventName;
      event.price = price;
      event.location = location;
      event.rating = rating;
      event.description = description;

      if (req.file) {
        fs.unlink(event.photo, (err) => {
          if (err) {
            console.log("Error while deleting file ", err);
          }
        });
        event.photo = req.file.path;
      }

      event
        .save()
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
