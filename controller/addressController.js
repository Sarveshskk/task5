const Address = require("../models/address");
require("dotenv").config();

exports.address = async (req, res) => {
    try {
        let user = req.user;
        const address = await Address.create({
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pin_code: req.body.pin_code,
            phone_no: req.body.phone_no,
            user_id:user["id"]
        })
        if(!address){
            res.status(400).send("address not created");
        }else{
            res.status(200).send("address created successfully");
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message)
    });
}

exports.deleteAddress = async (req, res) => {
    try {
        let user = req.user;
            let userAddress = await Address.destroy({
                where: {
                  user_id: user["id"]
                }
              });
            if (!userAddress) {
                res.status(401).send("address of the user not deleted")
            } else {
                res.status(200).send("address of the user deleted successfully");
            }
    } catch (error) {
        res.status(400).send(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};
