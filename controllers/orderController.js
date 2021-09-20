//On import le model de 2 crudes
const product = require('../models/products');
const order = require('../models/orders');
const user = require('../models/users');
const mongoose = require("mongoose");
//Recuperer les id
const ObjetId = require('mongoose').Types.ObjectId;

  
exports.getOrders = (req , res, next)=>
{
   
    order.find()
        .select("products quantity user amount adress status")
        .populate('products', 'name')
        .populate('user', 'firstName' , 'lastName')
        .exec()
        .then(docs  =>{
           const response = {
               count : docs.length,
               orders : docs.map(doc=>{
                   return {
                    _id: doc._id,
                    products : doc.products.productId,
                    quantity : doc.products.quantity,
                    amount : doc.amount,
                    user : doc.user,
                    address: doc.address,
                    status: doc.status,
                    request: {
                      type: "GET",
                      url: "http://localhost:3000/orders/" + doc._id
                    }
                   };
               })
           }; 
           res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
};

exports.createOrder = (req, res, next) => {

    user.findById(req.body.userId)
    product.findById(req.body.productId)
      .then(() => {
        const prod = new order({
          _id: mongoose.Types.ObjectId(),
          user : req.body.userId,
          products: req.body.products,
          amount : req.body.amount,
          address : req.body.address,
          status : req.body.status
        });
        return prod.save();
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Order stored",
          createdOrder: {
            _id: result._id,
            user : result.user,
            amount : result.amount,
            address : result.address,
            status : result.status,
            products: result.products
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + result._id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };
  
  exports.oneOrder = (req, res, next) => {
    const id = req.params.orderId;
    order.findById(id)
      .select('user products amount adress status')
      .populate('user')
      .populate('products')
      .exec()
      .then(doc => {
        if (!doc) {
          return res.status(404).json({
            message: "Order not found"
          });
        } 
        res.status(200).json({
          order: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders" + id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
};

//For Update
exports.modifyOrder = (req, res, next)=>
{
   const id = req.params.orderId;
   if(!ObjetId.isValid(id))
   return res.status(400).send("ID unknow :" +id);
   const updateRecord = {
    id: mongoose.Types.ObjectId(),
    user : req.body.userId,
    products : req.body.products,
    amount : req.body.amount,
    address : req.body.address,
    status : req.body.status
  };
  order.findByIdAndUpdate(
    req.params.orderId,
    {$set : updateRecord},
    {new : true},
    (err,docs )=> {
         if (!err) 
         res.status(200).json({
          message: 'Order updated',
          UpdateOrder : {
            _id: docs._id,
            user : docs.user,
            amount : docs.amount,
            address : docs.address,
            status : docs.status,
            products: docs.products,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + id
            }
          } 
      });
      
        console.log('Error Update : '+ err);
    } 
)};
exports.deleteAllOrders = (req, res, next) => {
  order.deleteMany({})
  .then(data => {
    res.send({
      message: `${data.deletedCount} Orders were deleted successfully!`
    });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all category."
    });
  });
};

exports.deleteOrder=  (req, res, next) => {
  order.findByIdAndRemove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: { userId: "ID", productId: "ID", status: 'String', amount: 'Number', adress: 'Object' }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};