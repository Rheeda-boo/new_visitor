const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const guest = new Schema(
    {
    guestName:  { 
      type :String,
     },  

    phoneNo: { 
      type :String,
     },  

    email:{ 
      type :String,
     },  

    hostName:{ 
      type :String,
     },   
     
     hostDept:{ 
      type :String,
     },

     purpose:{ 
      type :String,
     },

    status: { 
      type :String,
     },  

     created: { 
      type :String,
     },  
 
    timeIn: { 
      type :String,
     },  

    timeOut: { 
      type :String,
     },   

     role: { 
      type :String,
     }, 
    
    createdAt :{ 
      type :String,
     },   

     qr :{ 
      type :String,
     },
   
    visitNo: { 
      type :Number,
     },   
  }
  );
  
  module.exports = mongoose.model("Guest", guest);