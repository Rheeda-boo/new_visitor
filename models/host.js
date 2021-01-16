const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const host = new Schema(
    {
    hostName: { 
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
    hostDept: { 
      type :String,
     },
    created_at: { 
      type :String,
     },
    role: String, //from server side
    visitors: Number //from server side
  });
  
  module.exports = mongoose.model("Host", host);