//On import le model de 2 crudes
const users = require('../models/users');
const mongoose = require("mongoose");
//Recuperer les id
const ObjetId = require('mongoose').Types.ObjectId;

  
exports.getUsers = (req , res, next)=>
{
   
    users.find()
        .select("firstName lastName sexe pseudo description email zipCode phone birthdat isAdmin")
        .exec()
        .then(docs  =>{
           const response = {
               count : docs.length,
               users : docs.map(doc=>{
                   return {
                    _id: doc._id,
                    firstName : doc.firstName,
                    lastName : doc.lastName,
                    sexe : doc.sexe,
                    pseudo : doc.pseudo,
                    description : doc.description,
                    email : doc.email,
                    zipCode : doc.zipCode,
                    phone : doc.phone,
                    birthdat : doc.birthdat,
                    isAdmin : doc.isAdmin
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
exports.createUser=(req, res, next) => {
  
  const user = new users({
    _id: mongoose.Types.ObjectId(),
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    sexe : req.body.sexe,
    pseudo : req.body.pseudo,
    description : req.body.description,
    email : req.body.email,
    zipCode : req.body.zipCode,
    phone : req.body.phone,
    birthdat : req.body.birthdat,
    isAdmin :  req.body.isAdmin
  });
  user
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created user successfully",
        createdUser: {
            _id: result._id,
            firstName : result.firstName,
            lastName : result.lastName,
            sexe : result.sexe,
            pseudo : result.pseudo,
            description : result.description,
            email : result.email,
            zipCode : result.zipCode,
            phone : result.phone,
            birthdat : result.birthdat,
            isAdmin : result.isAdmin,
            request: {
                type: 'GET',
                url: "http://localhost:3000/users/" + result._id
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

exports.oneUser = (req, res, next) => {

    const id = req.params.userId;
    users.findById(id)
      .select('firstName lastName sexe pseudo description email zipCode phone birthdat')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
            _id: doc._id,
            firstName : doc.firstName,
            lastName : doc.lastName,
            sexe : doc.sexe,
            pseudo : doc.pseudo,
            description : doc.description,
            email : doc.email,
            zipCode : doc.zipCode,
            phone : doc.phone,
            birthdat : doc.birthdat,
            isAdmin : doc.isAdmin,
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/users'
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
exports.modifyUser = (req, res, next)=>
{
  const id = req.params.userId;
   if(!ObjetId.isValid(id))
   return res.status(400).send("ID unknow :" +id);
   const updateRecord = {
    id: mongoose.Types.ObjectId(),
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    sexe : req.body.sexe,
    pseudo : req.body.pseudo,
    description : req.body.description,
    email : req.body.email,
    zipCode : req.body.zipCode,
    phone : req.body.phone,
    birthdat : req.body.birthdat,
    isAdmin : req.body.isAdmin,
  };
  users.findByIdAndUpdate(
    req.params.userId,
    {$set : updateRecord},
    {new : true},
    (err,docs )=> {
         if (!err) 
         res.status(200).json({
          message: 'User updated',
          UpdateUser : {
            _id: docs.id,
            firstName : docs.firstName,
            lastName : docs.lastName,
            sexe : docs.sexe,
            pseudo : docs.pseudo,
            description : docs.description,
            email : docs.email,
            zipCode : docs.zipCode,
            phone : docs.phone,
            birthdat : docs.birthdat,
            isAdmin : doc.isAdmin,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/users/' + id
            }
          } 
      });
      
        console.log('Error Update : '+ err);
    } 
)};

exports.deleteAllUsers = (req, res, next) => {
    users.deleteMany({})
  .then(data => {
    res.send({
      message: `${data.deletedCount} User were deleted successfully!`
    });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all user."
    });
  });
};

exports.deleteUser = (req, res, next) => {
    const id = req.params.userId;
    users.findByIdAndRemove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'User deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/users',
                body: { firstName: 'String' , lastName: 'String',sexe : 'String',pseudo: 'String',description: 'String' }
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