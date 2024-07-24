const mongoose = require('mongoose');
 


const UserSchema = mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String
  });
  
  const Usermodel = mongoose.model('User', UserSchema);

  module.exports = Usermodel;