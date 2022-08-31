const express = require('express');
const router = express.Router();
const images = require('../modules/images');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'video/mp4'];

router.post('/add', async(req, res)=>{
   const {name, type, img} = req.body;
   const imgs = new images({
      name,
     type
   });

   saveImage(imgs , img);
   try{
      const savedimg = await imgs.save();
      res.redirect('/');
   }catch(error){
      console.error(error);
   }

})

// // save image as binary file
function saveImage(imgs , imgEncoded){
   if(imgEncoded == null) return;
   const imag = JSON.parse(imgEncoded);
   console.log(imag);
   if(imag!=null && imageMimeTypes.includes(imag.type)){
      imgs.img =new Buffer.from(imag.data , 'base64');
      imgs.imgType = imag.type;
   }
}

module.exports = router;