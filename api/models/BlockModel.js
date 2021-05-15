var bs = require("../config/bs");
var RoomBs = require("../models/RoomModel")

var BlockBs = bs.model('blocks', {
    tableName: 'blocks',

    rooms: function () {
        return this.hasMany('rooms', "block_id", "id")
    }
});

module.exports = BlockBs;