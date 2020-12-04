var bs = require("../config/bs");
var BlockBs = require("../models/BlockModel")


var RequestBs = bs.model('requests', {
    tableName: 'requests',

    // block: function  () {
    //     return this.hasOne(BlockBs, "id", "block_id")
    // }
});

module.exports = RequestBs;