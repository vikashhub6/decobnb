// External Module
const express = require("express");
const hostRouter = express.Router();


// Local Module
const hostController = require("../controllers/hostController");

hostRouter.get("/add-event", hostController.getAddevent);
hostRouter.post("/add-event", hostController.postAddevent);
hostRouter.get("/host-event-list", hostController.getHostevents);
hostRouter.get("/edit-event/:eventId", hostController.getEditevent);
hostRouter.post("/edit-event", hostController.postEditevent);
hostRouter.post("/delete-event/:eventId", hostController.postDeleteevent);
hostRouter.get("/delete-event/:eventId", hostController.postDeleteevent);
hostRouter.get("/orders", hostController.getorders);
hostRouter.post('/suggest-price', hostController.suggestPrice);
module.exports = hostRouter;
  