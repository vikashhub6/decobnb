

const Event_class = require('../models/event')
const User = require('../models/user')
const Booked = require('../models/booked'); 




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
exports.geteventDetails = async (req, res, next) => {
  const eventId = req.params.eventId;
  const event = await Event_class.findById(eventId).populate('hostId');

  if (!event) {
    console.log("event not found");
    return res.redirect("/events");
  }

  res.render("store/event-detail", {
    event: event,
    pageTitle: "event Detail",
    currentPage: "event",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getMyBookings = async (req, res, next) => {
  const customerId = req.session.user._id;
  console.log("BOOKINGS ROUTE HIT");
  
  const bookings = await Booked.find({ customerId: customerId })
    .populate('eventId')
    .populate('hostId');

  res.render('store/bookings', {
    bookings: bookings,
    pageTitle: "My Bookings",
    currentPage: "bookings",  // <-- yeh add karo
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};



