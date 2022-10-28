const express = require("express");
require("./db/connect");
require("dotenv");
const app  = express();
const router = require("./routes/users");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(router);

app.listen(()=>{
    console.log(`server is listining at ${port}`);
})


