const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Admin = require("../models/admin");
const Guest = require("../models/guest");
const Host = require("../models/host");
const bcrypt = require("bcrypt");


router.post("/addAdmin", (req,res) => {
 
        const { adminName, email, password, password2, } = req.body;
        let errors = [];
        // console.log(" Name " + name + " email :" + email + " pass:" + password);
        if (!adminName || !email || !password || !password2) {
          errors.push({ msg: "Please fill in all fields" });
        }
        //check if match
        if (password !== password2) {
          errors.push({ msg: "Passwords do not match" });
        }
      
        if (password.length < 6) {
          errors.push({ msg: "Password must be at least 6 characters" });
        }
        if (errors.length > 0) {
          res.send(errors);
        } else {
          //validation passed
          Admin.findOne({ email: email }).exec((err, admin) => {
            // console.log(user);
            if (admin) {
              errors.push({ msg: "Email already registered" });
              res.send({ msg: "Email already registered" });
            } else {
              const newAdmin = new Admin({
                adminName: adminName,
                email: email,
                password: password,
                role: "admin",
              });
      
              //hash password
              bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                  if (err) throw err;
                  //save pass to hash
                  newAdmin.password = hash;
                  //save user
                  newAdmin
                    .save()
                    .then((value) => {
                     
                      res.send("Admin Created");
                    })
                    .catch((value) => console.log(value));
                })
              );
            }
          });
        }
})

router.post("/addHost", (req,res) => {
 
    const { hostName, email, password, password2, phoneNo,hostDept } = req.body;
    let errors = [];
    // console.log(" Name " + name + " email :" + email + " pass:" + password);
    if (!hostName || !email || !password || !password2 || !phoneNo || !hostDept) {
      errors.push({ msg: "Please fill in all fields" });
    }
    //check if match
    if (password !== password2) {
      errors.push({ msg: "Passwords do not match" });
    }
  
    // if (password.length < 6) {
    //   errors.push({ msg: "Password must be at least 6 characters" });
    // }
    if (errors.length > 0) {
      res.send(errors);
    } else {
      //validation passed
      Host.findOne({ email: email }).exec((err, host) => {
        // console.log(user);
        if (host) {
          errors.push({ msg: "Email already registered" });
          res.send({ msg: "Email already registered" });
        } else {
          const newHost = new Host({
            hostName: hostName,
            email: email,
            password: password,
            role: "host",
            hostDept: hostDept,
            phoneNo: phoneNo,
          });
  
          //hash password
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newHost.password, salt, (err, hash) => {
              if (err) throw err;
              //save pass to hash
              newHost.password = hash;
              //save user
              newHost
                .save()
                .then((value) => {
                 
                  res.send("Host Created");
                })
                .catch((value) => console.log(value));
            })
          );
        }
      });
    }
})

router.post("/addGuest", (req, res) => {
    const { name, email, purpose, phoneNo, hostDept, hostName} = req.body;
    let errors = [];
    // console.log(" Name " + name + " email :" + email + " pass:" + password);
    if (!name || !email || !hostName || !hostDept  || !phoneNo || !purpose) {
      errors.push({ msg: "Please fill in all fields" });
      res.send({ msg: "Please fill in all fields" });
    }
     else {
      //validation passed
      Guest.findOne({ email: email }).exec((err, guest) => {
        // console.log(user);
        if (guest) {
          res.send({ msg: "Already here" })
        } else {
            
        const newGuest = new Guest({
            adminName: adminName,
            email: email,
            hostDept: hostDept,
            purpose : purpose,
            hostName: hostName,
            phoneNo : phoneNo,
            role : "guest",
            created : new Date(),
            
            
        });

        newGuest
          .save()
          .then((value) => {
            res.send("Guest Created");
          })
          .catch((value) => console.log(value));
        }
        
    })
  } 
})

router.delete("/delAdmin/:id", (req, res) => {
    const aId = req.params.id;
    Admin.deleteOne({ _id: mongoose.Types.ObjectId(aId) }, (err) => {
      if(err){
          console.error(err);
          res.send({ error: err });
          return;
      }
   
      console.log("ADMIN DELETED");
      res.send({ msg: "Admin DELETED" });
   
    });
})

router.delete("/delHost/:id", (req, res) => {
    const hId = req.params.id;
    Host.deleteOne({ _id: mongoose.Types.ObjectId(hId) }, (err) => {
      if(err){
          console.error(err);
          res.send({ error: err });
          return;
      }
   
      console.log("Host DELETED");
      res.send({ msg: "Host DELETED" });
   
    });
})

router.put("/update/:id", (req, res) => {
    if (!req.body.email || !req.body.adminName || !req.body.phoneNo) {
      res.status(400).send({
        message: "required fields cannot be empty",
      });
    }
    Admin.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((admin) => {
        if (!admin) {
          return res.send({
            message: "no user found",
          });
        }
       else res.send("Admin updated")
      })
      .catch((err) => {
        return res.send({
          message: "error while updating the post",
        });
      });
})

router.get("/allusers", (req,res) => {
  Admin.find({},(err,admin) => {
    if(err){
        console.error(err);
        res.send({error : err});
        return;
    }
    adminNum = admin.length
    console.log("ADMIN LIST READ");
    // res.send();
  });

  Guest.find({},(err,guest) => {
    if(err){
        console.error(err);
        res.send({error : err});
        return;
    }
    guestNum = guest.length
    console.log("Guest LIST READ");
    // res.send();
  });

Host.find({},(err,host) => {
  if(err){
      console.error(err);
      res.send({error : err});
      return;
  }
  num = host.length
  console.log("HOSTS LIST READ");
  res.send({"Hosts" : num, "Admins" : adminNum, "Guests" : guestNum});
});
}) 

module.exports = router;

