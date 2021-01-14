const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const User = require("../models/user");
const Admin = require('../models/admin');
const Host = require('../models/host');
const Guest = require('../models/guest');
const bcrypt = require("bcrypt");
const passport = require("passport");


router.post("/login", (req, res, next) => {
  
  const email = req.body.email;
  const password = req.body.password;
  // const role =  req.body.role;


Host.findOne({ email: email }).exec((err, host) => {

  if (host) {
    bcrypt.compare(password, host.password).then(doMatch => {
        if (doMatch) {

          return res.send({ message: `Welcome ${host.name} (Host)` });
        }
      })}
      if (!host) {
        Admin.findOne({ email: email }).exec((err, admin) => {

          if (admin) {
            console.log('hi')

            bcrypt.compare(password, admin.password).then(doMatch => {
                if (doMatch) {
      
                  return res.send({ message: `Welcome ${admin.adminName} (Admin)` });
                }
              }
              )}
          
      
      if (!admin) {
          res.send({message: "Not a user"})
         }
  // })
  }
  )
        // res.send('noooo')
      }
})
})


router.post("/logout", (req,res) => {
  req.logout();
res.send({msg :"you are logged out"})
})
  
module.exports = router;

