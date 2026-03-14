// External Module
const express = require("express");
const adminRouter = express.Router();

// Local Module
const adminController = require("../controllers/admincontroller");



adminRouter.post("/booked", adminController.postbooked );
module.exports = adminRouter;