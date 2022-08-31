const mongoose = require('mongoose');
const {Schema} = mongoose;
const imageSchema = new Schema({
   name: {
      type:String,
      required:true
   },
   type:{
      type:String,
      required:true
   },
   img:
   {
       type: Buffer,
       required: true
   },
   imgType:{
      type:String,
      required:true
   },
})

imageSchema.virtual('coverImagePath').get(function(){
   if(this.img!=null && this.imgType!=null){
      return `data:${this.imgType}; charset=utf-8;base64,${this.img.toString('base64')}`
   }
})
module.exports = mongoose.model('images ', imageSchema);