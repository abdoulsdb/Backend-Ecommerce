const mongoose = require('mongoose');

const users = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
      
      firstName:
        {
           type : String,
         required : true
       },
       lastName:
       {
          type : String,
        required : true
      },
    sexe:
    {
        type: String,
        required : true
    },
    pseudo:
    {
       type : String,
     required : true
    },
     description:
     {
         type : String,
         required : true
     },
     email:
     {
         type : String,
         lowercase: true,
         unique : true,
         required : true
     },
     zipCode: {
        type: Number,
        min: [1000, "Zip code too short"],
        max: 99999
      },
     phone:
     {
         type : String,
         required : true
     },
     birthdat:
     {
        type : Date,
        default : Date.now
     },
  }, 
 {
  timestamps: true,
 });

module.exports = mongoose.model('Users', users);