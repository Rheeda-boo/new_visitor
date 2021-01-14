const mongoose = require("mongoose");
const connection = mongoose.connection;

mongoose.connect( 
    // "mongodb+srv://boobooboo:boobooboo@your-lunch-cluster.yzzin.mongodb.net/YourLunch?retryWrites=true&w=majority",
    "mongodb://localhost:27017/newVisitor",
 {useNewUrlParser: true}, 
 { useUnifiedTopology: true } );

connection.on("connected", () => {
    console.log("Database connected successfully");
});

connection.on("disconnected", () => {
    console.log("Database not connected");
});

connection.on("error", () => {
    console.error(error);
});

module.exports = connection;