var bs = require("../config/bs");
// var BlockBs = require("../models/BlockModel")
// var UserBs = require("../models/UserModel")
// var RoomBs = require("../models/RoomModel")

var BookingBs = bs.model('bookings', {
    tableName: 'bookings',

    room: function  () {
        return this.hasOne('rooms', "id", "room_id")
    },
    user: function  () {
        return this.hasOne('users', "id", "user_id")
    },

});

module.exports = BookingBs;