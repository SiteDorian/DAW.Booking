var bs = require("../config/bs");

var RoomBs = bs.model('rooms', {
    tableName: 'rooms'
});

module.exports = RoomBs;