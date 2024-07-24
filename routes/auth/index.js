const express = require('express');
const routes = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Usermodel = require('../../user');
const {Login, Register} = require('../../controller/index-controller');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';
 

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
  

  async function hashpass(password) {
    const res = await bcrypt.hash(password, 10);
    return res;

}

routes.post('/login', Login );

// Corrected POST route for registration
routes.post('/Register', Register );



// Define the User schema


module.exports = routes;