//On import le model de 2 crudes
const products = require('../models/products');
const category = require('../models/category');
const mongoose = require("mongoose");
//Recuperer les id
const ObjetId = require('mongoose').Types.ObjectId;

  
exports.getProduct = (req , res, next)=>
{
   
    products.find()
        .select("name price stock description createdat expiratedat productImage category")
        .populate('category', 'name')
        .exec()
        .then(docs  =>{
           const response = {
               count : docs.length,
               products : docs.map(doc=>{
                   return {
                    _id: doc._id,
                    name : doc.name,
                    feeTp : doc.feeTp,
                    description : doc.description,
                    price : doc.price,
                    createdat : doc.createdat,
                    expiratedat : doc.expiratedat,
                    stock : doc.stock,
                    productImage : doc.productImage,
                    category: doc.category,
                    request: {
                      type: "GET",
                      url: "http://localhost:3000/products/" + doc._id
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

exports.createProduct = (req, res, next) => {

  category.findById(req.body.categoryId)
    .then(category => {
      if (!category) {
        return res.status(404).json({
          message: "Category not found"
        });
      }
      const prod = new products({
        _id: mongoose.Types.ObjectId(),
        name : req.body.name,
        feeTp : req.body.feeTp,
        description : req.body.description,
        price : req.body.price,
        createdat : req.body.createdat,
        expiratedat : req.body.expiratedat,
        stock : req.body.stock,
        productImage : req.file.path,
        category: req.body.categoryId
      });
      return prod.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Products stored",
        createdProduct: {
          _id: result._id,
          name : result.name,
          feeTp : result.feeTp,
          description : result.description,
          price : result.price,
          createdat : result.createdat,
          expiratedat : result.expiratedat,
          stock : result.stock,
          category: result.category,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + result._id
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

exports.oneProduct = (req, res, next) => {
    const id = req.params.productId;
    products.findById(id)
      .select('name price stock description createdat expiratedat productImage category')
      .populate('category')
      .exec()
      .then(doc => {
        if (!doc) {
          return res.status(404).json({
            message: "Product not found"
          });
        } 
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products"
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
};

//For Update
exports.modifyProduct = (req, res, next)=>
{
  const id = req.params.productId;
   if(!ObjetId.isValid(id))
   return res.status(400).send("ID unknow :" +id);
   const updateRecord = {
    id: mongoose.Types.ObjectId(),
    name : req.body.name,
    feeTp : req.body.feeTp,
    description : req.body.description,
    price : req.body.price,
    createdat : req.body.createdat,
    expiratedat : req.body.expiratedat,
    stock : req.body.stock,
    productImage : req.file.path,
    category: req.body.categoryId
  };
  products.findByIdAndUpdate(
    req.params.productId,
    {$set : updateRecord},
    {new : true},
    (err,docs )=> {
         if (!err) 
         res.status(200).json({
          message: 'Product updated',
          UpdateProduct : {
            _id: docs._id,
            name : docs.name,
            feeTp : docs.feeTp,
            description : docs.description,
            price : docs.price,
            createdat : docs.createdat,
            expiratedat : docs.expiratedat,
            stock : docs.stock,
            category: docs.category,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
          } 
      });
      
        console.log('Error Update : '+ err);
    } 
)};

exports.deleteProduct=  (req, res, next) => {
  products.findByIdAndRemove({ _id: req.params.productId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          body: { categoryId: "ID", name: 'String', price: 'Number', description: 'String', stock: 'Number'  }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

  