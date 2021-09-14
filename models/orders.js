const mongoose = require('mongoose');

const orders = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    price : {type : Number, required: true},
    createdat: {   type : Date,default : Date.now},
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Orders', orders);