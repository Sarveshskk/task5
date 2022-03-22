const express = require("express");
const verifyToken = require("../middleware/verifyToken");

let addressRoute = express.Router(),
{
    address,
    deleteAddress
} = require("../controller/addressController");

addressRoute.post("/createAddress",verifyToken, address);
addressRoute.delete("/deleteAddress", verifyToken,deleteAddress);

module.exports = addressRoute;