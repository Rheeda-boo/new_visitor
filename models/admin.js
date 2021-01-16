const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const admin = new Schema(
  {
    adminName: { 
      type :String,
     },
    email: { 
      type :String,
     },
    password: { 
      type :String,
     },
    phoneNo: { 
      type :String,
     },
    createdAt: { 
      type :String,
     },
    role: { 
      type :String,
     },
  });
  
  module.exports = mongoose.model("Admin", admin);