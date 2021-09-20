//On import le model de 2 crudes
const category = require('../models/category');
const mongoose = require("mongoose");
//Recuperer les id
const ObjetId = require('mongoose').Types.ObjectId;

  
exports.getCategory = (req , res, next)=>
{
   
    category.find()
        .select("name categoryImage")
        .exec()
        .then(docs  =>{
           const response = {
               count : docs.length,
               category : docs.map(doc=>{
                   return {
                    name : doc.name,
                    categoryImage : doc.categoryImage
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
exports.createCategory=(req, res, next) => {

  const categ = new category({
    _id: mongoose.Types.ObjectId(),
      name : req.body.name,
      categoryImage : req.file.path
  });
  categ
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created category successfully",
        createdCategory: {
            _id: result._id,
            name: result.name,
            categoryImage: result.categoryImage,
            request: {
                type: 'GET',
                url: "http://localhost:3000/category/" + result._id
            }
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

exports.oneCategory = (req, res, next) => {

    const id = req.params.categoryId;
    category.findById(id)
      .select('name categoryImage')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
              category: doc,
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/category'
              }
          });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
};

//For Update
exports.modifyCategory = (req, res, next)=>
{
  const id = req.params.categoryId;
   if(!ObjetId.isValid(id))
   return res.status(400).send("ID unknow :" +id);
   const updateRecord = {
    id: mongoose.Types.ObjectId(),
    name : req.body.name,
    categoryImage : req.file.path,
  };
category.findByIdAndUpdate(
    req.params.categoryId,
    {$set : updateRecord},
    {new : true},
    (err,docs )=> {
         if (!err) 
         res.status(200).json({
          message: 'Category updated',
          UpdateCategory : {
            _id: docs.id,
            name: docs.name,
            categoryImage : docs.categoryImage,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/category/' + id
            }
          } 
      });
      
        console.log('Error Update : '+ err);
    } 
)};

exports.deleteAllCategory = (req, res, next) => {
  category.deleteMany({})
  .then(data => {
    res.send({
      message: `${data.deletedCount} Category were deleted successfully!`
    });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all category."
    });
  });
};

exports.deleteCategory = (req, res, next) => {
    const id = req.params.categoryId;
    category.findByIdAndRemove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Category deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/category',
                body: { name: 'String'}
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