var conf =  require("./db-data");

let dbConfig = {
    client: conf.dialect || "mysql",

    debug: false, //process.env.DEBUG,

    connection: {
        host: conf.host || "localhost",
        user: conf.username || "root",
        password: conf.password || "",
        database: conf.database || "text-error-fixer",
        charset: "utf8mb4"
    }
};
const knex = require("knex")(dbConfig);

module.exports =  knex;