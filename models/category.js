const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, unique : true,},
    categoryImage :
    {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Categories', categorySchema);