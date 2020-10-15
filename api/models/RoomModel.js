var bs = require("../config/bs");
var BlockBs = require("../models/BlockModel")

var RoomBs = bs.model('rooms', {
    tableName: 'rooms',

    block: function  () {
        return this.hasOne(BlockBs, "id", "block_id")
    }
});

module.exports = RoomBs;