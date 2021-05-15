var bs = require("../config/bs");
var BlockBs = require("../models/BlockModel")

var RoomBs = bs.model('rooms', {
    tableName: 'rooms',

    block: function  () {
        return this.hasOne('blocks', "id", "block_id")
    },

    bookings: function  () {
        return this.hasMany('bookings', "room_id", "id")
    }



});

module.exports = RoomBs;