const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const {google} = require("googleapis");

// const CLIENT_ID = "602644016780-0fmln2fnbr7pfonoh6fipdsst8j5tk74.apps.googleusercontent.com";
// const CLIENT_SECRET = "wVCBXNxwdZnhnmzmD5TlIvnU";
// const REDIRECT_URI = "https://developers.google.com/oauthplayground";
// const REFRESH_TOKEN = "1//04Jo0vgep_wLICgYIARAAGAQSNwF-L9Iry-cThDoRxlQ4RV5yLaV1Yhnz4Np9ghtML7t-djeiq8OPMp0WnU1Xnto9siN2jYItR10";
 

const CLIENT_ID = '954015788634-s9iars81l1nn1cc7qppeojdqnaalvbnd.apps.googleusercontent.com'
const CLIENT_SECRET = 'ApyM_FankDCPSupFDsOE43Kn'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04_gu52fkrO0zCgYIARAAGAQSNwF-L9IrwFq_toZVG2fWBtd2wIpMO3VT9IJq6fnoMaVyNvUC7xZKs7c_MEZ6ADBHc3OYaHOTZho'



const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,CLIENT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

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
            to : "pmyarashi@gmail.com",
            subject: "Guess who",
            text: "Goo me 😎",
            html: "<h1>Goo me 😎</h1>"
        };

        const result = await transport.sendMail(mailOptions)
        return result
    } catch (error) {
        return error
    }
}

// sendMail().then(result => console.log("Email sent.....", result))
// .catch((error) => console.log(error.message));

const database = require("./config/database");

app.use(express.urlencoded({extended : false}));

const adminRouter = require("./routes/admin");
app.use("/admin", adminRouter);


const hostRouter = require("./routes/host");
app.use("/host", hostRouter);

const guestRouter = require("./routes/guest");
app.use("/guest", guestRouter);

const userRouter = require("./routes/users");
app.use("/users", userRouter)

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
 })
 


app.listen(1414);