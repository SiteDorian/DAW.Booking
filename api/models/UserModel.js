var bs = require("../config/bs");
var RequestBs = require("../models/RequestModel")
var BookingBs = require("../models/BookingModel")

var UserBs = bs.model('users', {
    tableName: 'users',

    requests: function  () {
        return this.hasMany(RequestBs, "user_id", "id")
    },

    bookings: function  () {
        return this.hasMany(BookingBs, "user_id", "id")
    }


});

module.exports = UserBs;