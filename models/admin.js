const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const admin = new Schema(
  {
    adminName: String, //from form
    email: String, //from form
    password: String, //from form
    phone: String, //from form
    created_at: String, //from server side
    role: String //from server side
  });
  
  module.exports = mongoose.model("Admin", admin);