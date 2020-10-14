var HomeController = require("../controllers/HomeController");

const express = require('express');
var homeRouter = express.Router();

new HomeController(homeRouter);

module.exports = homeRouter;