
const express = require('express');
const routes = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Cart = require('../../cart');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';
 const { Getcart, UpdateCart, Delete_cart, Add_to_cart} = require('../../controller/index-controller');




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








routes.post("/addtocart", Add_to_cart);
  
  routes.put("/updatecart", UpdateCart);
  
  routes.get("/get-cart/:id",authenticateToken, Getcart);
  routes.delete("/delete-cart/:id",  Delete_cart);

  module.exports = routes;


