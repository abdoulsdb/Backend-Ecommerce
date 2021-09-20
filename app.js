const express = require('express');
const app = express();
const mongoose = require('mongoose');
//Pour mieux manipuler le json
const bodyParser = require('body-parser');
const routerProducts = require('./routes/products');
const routerCategory = require('./routes/category');
const routerUser = require('./routes/users');
const routerOrder = require('./routes/orders');

mongoose.connect('mongodb+srv://sabdy:sabdy123456@ecommerceapi.up8ah.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
{useNewUrlParser :true ,useUnifiedTopology :true}).then(() =>{
    console.log('Connexion success !!')
}).catch((error) =>{
    console.log(error);
});
//app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
//app.use(filter());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });  
app.use('/api/products', routerProducts);
app.use('/api/category', routerCategory);
app.use('/api/users', routerUser);
app.use('/api/orders', routerOrder);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });

  
module.exports = app;