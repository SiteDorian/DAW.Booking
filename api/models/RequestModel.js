var bs = require("../config/bs");
var BlockBs = require("../models/BlockModel")


var RequestBs = bs.model('requests', {
    tableName: 'requests',

    room_from: function  () {
        return this.hasOne('rooms', "id", "room_from_id")
    },
    room_to: function  () {
        return this.hasOne('rooms', "id", "room_to_id")
    },
    user: function  () {
        return this.hasOne('users', "id", "user_id")
    },

    // block: function  () {
    //     return this.hasOne(BlockBs, "id", "block_id")
    // }
});

module.exports = RequestBs;