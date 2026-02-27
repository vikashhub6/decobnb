

const Event_class = require('../models/event')
const User = require('../models/user')





exports.getIndex = (req, res, next) => {
  console.log("Session Value: ", req.session);
   Event_class.find().then((registeredevents) => {
    res.render("store/index", {
      registeredevents: registeredevents,
      pageTitle: "airbnb event",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};

exports.getevents = (req, res, next) => {
   Event_class.find().then((registeredevents) => {
    res.render("store/event-list", {
      registeredevents: registeredevents,
      pageTitle: "events List",
      currentPage: "event",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn: req.isLoggedIn, 
    user: req.session.user,
  });
};

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
  res.render("store/favourite-list", {
    favouriteevents: user.favourites,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.isLoggedIn, 
    user: req.session.user,
  });
};

exports.postAddToFavourite = async (req, res, next) => {
  const eventId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(eventId)) {
    user.favourites.push(eventId);
    await user.save();
  }
  res.redirect("/favourites");
};


exports.postRemoveFromFavourite = async (req, res, next) => {
  const eventId = req.params.eventId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(eventId)) {
    user.favourites = user.favourites.filter(fav => fav != eventId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.geteventDetails = (req, res, next) => {
  const eventId = req.params.eventId;
   Event_class.findById(eventId).then((event) => {
    if (!event) {
      console.log("event not found");
      res.redirect("/events");
    } else {
      res.render("store/event-detail", {
        event: event,
        pageTitle: "event Detail",
        currentPage: "event",
        isLoggedIn: req.isLoggedIn, 
        user: req.session.user,
      });
    }
  });
};
