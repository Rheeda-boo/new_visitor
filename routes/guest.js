const express = require("express");
const router = express.Router();
const Guest = require("../models/guest");
const Host = require("../models/host");
const bcrypt = require("bcrypt");
var QRCode = require('qrcode')

const nodemailer = require("nodemailer");
const {google} = require("googleapis");
const guest = require("../models/guest");

const CLIENT_ID = '954015788634-s9iars81l1nn1cc7qppeojdqnaalvbnd.apps.googleusercontent.com'
const CLIENT_SECRET = 'ApyM_FankDCPSupFDsOE43Kn'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04_gu52fkrO0zCgYIARAAGAQSNwF-L9IrwFq_toZVG2fWBtd2wIpMO3VT9IJq6fnoMaVyNvUC7xZKs7c_MEZ6ADBHc3OYaHOTZho'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,CLIENT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});


router.post("/guestIn", (req, res) => {
    const { guestName, email, purpose, phoneNo, hostDept, hostName} = req.body;
    let errors = [];
    // console.log(" Name " + name + " email :" + email + " pass:" + password);
    if (!guestName || !email || !hostName || !hostDept  || !phoneNo || !purpose) {
      errors.push({ msg: "Please fill in all fields" });
      res.send({ msg: "Please fill in all fields" });
    }
     else {
      //validation passed
      Host.findOne({ hostName: hostName }).exec((err, host) => {
        // console.log(user);
         if (host) {

        //   res.send({ msg: "Already here" })
        // } else {
          // QRCode.toDataURL(`${guestName}`,{errorCorrectionLevel:'H'}, function (err,url) {    
        const newGuest = new Guest({
            guestName: guestName,
            email: email,
            hostDept: hostDept,
            purpose : purpose,
            hostName: hostName,
            phoneNo : phoneNo,
            role : "guest",
            status: "logged in",
            // created : new Date(),
            timeIn : new Date(),
            // qr:url,
        });

          newGuest
          .save()
          .then((value) => {
            async function sendMail() {
              try {
                  const accessToken = await oAuth2Client.getAccessToken()
                  const transport = nodemailer.createTransport({
                      service: "gmail",
                      auth: {
                          type: "OAuth2",
                          user: "patrick.markin-yankah@amalitech.org",
                          clientId: CLIENT_ID,
                          clientSecret: CLIENT_SECRET,
                          refreshToken: REFRESH_TOKEN,
                          accessToken:accessToken, 
                      }
                  })
          
                  const mailOptions = {
                      from: "Rheeda Boo<rheeda.beecha@gmail.com>",
                      to : `${host.email}`,
                      subject: "Guest Awaits",
                      text: `You have a guest ${guestName}, please go to the recieption area`,
                      html: `You have a guest ${guestName}, please go to the recieption area`
                  };
          
                  const result = await transport.sendMail(mailOptions)
                  return result
              } catch (error) {
                  return error
              }
          }
          
           res.send(`Notifation sent to ${hostName}, Please wait in the reception area`)
           sendMail().then()
          
          .catch((error) => res.send(error.message));
            // Host.findOne({ hostName: hostName }).exec((err, host) => {
            //   if (host) {
            //     console.log({ msg: `message  sent to ${hostName}` })
            //   }
            // res.send(`Guest Logged in and notification sent to ${hostName}`);

          }) 
          .catch((value) => console.log(value));
        
          
           }
          else {
            res.send({msg:"Nobody"})
          }
        }) 
        }
     
    // )
      
  })

router.put("/guestout", (req, res) => {
  const email = req.body.email;
 
  //checking if any guest with this email is in the offices
  Guest.findOne({ email : email, status:"logged in" }, (err, guest) => {
    if (err) {
        console.error(err);
        res.send({ error: err });
        return;
        }
    
    //if no visitor is inside - there is an error
    if (guest === null) {
      console.log("no visitor is found");
      res.send({ error: "NO VISITOR FOUND" });
      return;
 
    }else{
      //checking out the user - if the visitor is inisde
      req.logout();
      console.log("Log")
      guest.timeOut = new Date();
      guest.status = "logged out";
      guest.save((err) => {
          if (err) {
          console.error(err);
          res.send({ error: err });
          return;
          }
          else{
            
                res.send({ msg: "Logged out" });
                return;   
          } 
      })
    }
  });
});

router.put("/qrguestIn", (req, res) => {
  const qr = req.body.qr;
  Host.findOne({}).exec((err, host) => {

    Guest.findOne({ qr: qr}, (err, guest) => {
      if (err) {
        console.error(err);
        res.send({ error: err });
        return;
      }
      guest.status = "logged in",
      guest.timeIn = new Date(),
      guest
      .save()
      .then((value) => {
        async function sendMail() {
          try {
              const accessToken = await oAuth2Client.getAccessToken()
              const transport = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                      type: "OAuth2",
                      user: "patrick.markin-yankah@amalitech.org",
                      clientId: CLIENT_ID,
                      clientSecret: CLIENT_SECRET,
                      refreshToken: REFRESH_TOKEN,
                      accessToken:accessToken, 
                  }
              })
      
              const mailOptions = {
                  from: "Rheeda Boo<rheeda.beecha@gmail.com>",
                  to : `${host.email}`,
                  subject: "Guest Awaits",
                  text: `You have a guest ${guestName}, please go to the recieption area`,
                  html: `You have a guest ${guestName}, please go to the recieption area`
              };
      
              const result = await transport.sendMail(mailOptions)
              return result
          } catch (error) {
              return error
          }
      }
      
      res.send(`Notifation sent to ${host.hostName}, Please wait in the reception area`)
      sendMail().then()
      
      .catch((error) => res.send(error.message));
        // Host.findOne({ hostName: hostName }).exec((err, host) => {
        //   if (host) {
        //     console.log({ msg: `message  sent to ${hostName}` })
        //   }
        // res.send(`Guest Logged in and notification sent to ${hostName}`);

      })  
      .catch((value) => console.log(value));
    })
  })  
}) 


router.put("/qrguestOut", (req, res) => {
  const qr = req.body.qr;
  Host.findOne({}).exec((err, host) => {

    Guest.findOne({ qr: qr}, (err, guest) => {
      if (err) {
        console.error(err);
        res.send({ error: err });
        return;
      }
      guest.status = "Logged out",
      guest.timeOut = new Date(),
      guest
      .save()
      .then((value) => {
        
          res.send(`Notifation sent to ${host.hostName}, Please wait in the reception area`)
            .catch((error) => res.send(error.message));
        
      })  
      .catch((value) => console.log(value));
    })
  })  
}) 

  module.exports = router;