const express = require("express");
const router = express.Router();
const Guest = require("../models/guest");
const Host = require("../models/host");
var QRCode = require('qrcode')


router.put("/update/:id", (req, res) => {
    if (!req.body.email || !req.body.hostDept || !req.body.hostName || !req.body.phoneNo) {
      res.status(400).send({
        message: "required fields cannot be empty",
      });
    }
    Host.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((host) => {
        if (!host) {
          return res.status(404).send({
            message: "no user found",
          });
        }
       else res.send("Host updated")
      })
      .catch((err) => {
        return res.status(404).send({
          message: "error while updating the host",
        });
      });
})

router.post("/addguest", (req, res) => {
  const { guestName, email, purpose, phoneNo, hostDept, hostName} = req.body;
  let errors = [];
  // console.log(" Name " + name + " email :" + email + " pass:" + password);
  if (!guestName || !email || !hostName || !hostDept  || !phoneNo || !purpose) {
    errors.push({ msg: "Please fill in all fields" });
    res.send({ msg: "Please fill in all fields" });
  }
   else {
    //validation passed
    Guest.findOne({ email: email }).exec((err, guest) => {
      // console.log(user);
      // if (guest) {

      //   res.send({ msg: "Already here" })
      // } else {
    QRCode.toDataURL(`${guestName}`,{errorCorrectionLevel:'H'}, function (err,url) {    
      const newGuest = new Guest({
          guestName: guestName,
          email: email,
          hostDept: hostDept,
          purpose : purpose,
          hostName: hostName,
          phoneNo : phoneNo,
          role : "guest",
          // status: "logged in",
          // created : new Date(),
          // timeIn : new Date(),
          qr:url,
      });

        newGuest
        .save()
        console.log(guest.email)
        // .then((value) => {
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
                    to : `${guest.email}`,
                    subject: "Guest Awaits",
                    text: `You have a guest ${guestName}, please go to the recieption area`,
                    html: `You have a guest ${guestName}, please go to the recieption area`
                };
                 console.log()
                const result = await transport.sendMail(mailOptions)
                return result
            } catch (error) {
                return error
            }
        }
        
        sendMail().then(res.send(`Your appointment with  ${hostName} is ready`))
        
        .catch((error) => res.send(error.message));
          
        // })
        }) 

        
        }) 
      }
    
    
    // }
})





module.exports = router;
