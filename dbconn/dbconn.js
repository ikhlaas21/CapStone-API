require("dotenv").config();
const mysql = require("mysql");
const con = mysql.createPool({
    host: process.env.host,
    user: process.env.dbUser,
    password: process.env.dbPassword,
    database: process.env.dbName,
    multipleStatements:true
})

module.exports = con;