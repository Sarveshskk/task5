require("dotenv").config();
const express = require("express");
const route = require("./routes");

const app = express();

const db = require("./db");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", route.userRoute);
app.use("/address", route.addressRoute);

app.listen(process.env.PORT || 3003,()=>{
    console.log("server running...")
})

