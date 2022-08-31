const mongoose = require("mongoose");
require("dotenv").config();

const url =process.env.CONN_URL ;

const connectToMongo = () =>{
   mongoose.connect(url , ()=>{
      console.log('DataBase Connection Successful');
   })
}
module.exports = connectToMongo;

