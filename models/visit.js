const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const visit = new Schema(
    {
    guestName:{ 
        type :String,
       },
    hostName: { 
        type :String,
       },
    hostDept: { 
        type :String,
       },
    visited_at : { 
        type :String,
       },
    purpose : { 
        type :String,
       },
    check_out: { 
        type :String,
       },
  }
  );
  
  module.exports = mongoose.model("Visits", visit);