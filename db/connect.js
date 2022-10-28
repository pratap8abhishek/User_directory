const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/UserDataBase").then(()=>{
    console.log("Succesfully connected to data base");
}).catch(()=>{
    console.log("Error in connecting db");
})