// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/events", storeController.getevents);

storeRouter.get("/favourites", storeController.getFavouriteList);

storeRouter.get("/events/:eventId", storeController.geteventDetails);
storeRouter.post("/favourites", storeController.postAddToFavourite);
storeRouter.post("/favourites/delete/:eventId", storeController.postRemoveFromFavourite);
storeRouter.get("/bookings", storeController.getMyBookings); // getMyBookings ✅
module.exports = storeRouter;
