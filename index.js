const express = require('express');
const connectToMongo = require('./db');
const expressLayouts = require('express-ejs-layouts');
const images= require('./modules/images');
// const cors = require('cors');  // this is used to manage cross origin  flaw which restricts http request form browser
const bodyParser = require('body-parser');
require("dotenv").config();
connectToMongo();

const app = express();  // it returns various useful functions which is used to manage backend process

const port = process.env.PORT;
// app.use(imageUpload());

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
// in order to access the body of request we have to bring middleware in between i.e we have to use app.use(express.json());  this is defining that use the json file for input method as a req body.
app.use(express.json());    // middleware consists of three things request, response and next which helps in authenticating (and other usage) the code written by us and it call the 'next ' function which calls the actual route. if some flaw is validated we directly send the response 'bad req'
app.get('/' ,async (req,res)=>{
   const imgs  = await images.find();
   try{
   res.render("index", {
      imgs
    });
   }catch (err){
      console.log("err: "+ err);
    }
})

// app.use('/api/auth', require('./routers/auth'));

app.use('/api/img' , require('./routers/img'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})