const mongoose = require('mongoose');
const products = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:
    {
        type: String,
        required : true
    },
     description:
      {
         type : String,
       required : true
     },
     price:
     {
         type : Number,
         required : true
     },
     feeTp:
     {
         type : Number,
         required : true
     },
     stock:
     {
         type : Number,
         required : true
     },
     createdat:
     {
        type : Date,
        default : Date.now
     },
     expiratedat:
     {
        type : Date,
        default : Date.now
     },
     productImage :
     {
         type : String,
         required : true
     },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true }
});

module.exports = mongoose.model('Products',products);