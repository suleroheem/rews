
const express = require('express');
const routes = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Product = require('../../product');
 const {Create_product, Update_product, Get_product, Delete_product} = require('../../controller/index-controller');






 function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // If there's no token

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // If the token is invalid
    req.user = user;
    next();
  });

}











routes.post("/created-products", Create_product);



routes.get("/get-product",authenticateToken, Get_product );
  
  // Delete products endpoint
  routes.delete("/delete-products/:Id", Delete_product);
  
  // Route to update a product
  
routes.put("/update-products/:id", Update_product);;








module.exports = routes;