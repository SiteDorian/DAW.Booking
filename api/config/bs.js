var knex = require('./knex')

const bs = require("bookshelf")(knex);

bs.plugin(require("bookshelf-eloquent"));
bs.plugin(require("bookshelf-paranoia"));

bs.plugin("pagination");
bs.plugin("virtuals");

module.exports = bs;