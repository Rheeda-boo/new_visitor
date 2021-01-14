const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const host = new Schema(
    {
    hostName: String, //from form
    email: String, //from form
    password: String, //from form
    phoneNo: String, //from form
    hostDept: String, //from form
    created_at: String, //from server side
    role: String, //from server side
    visitors: Number //from server side
  });
  
  module.exports = mongoose.model("Host", host);