const jwt = require("jsonwebtoken");
const User = require("../models/users");
require("dotenv").config();

const resetToken = (req, res, next) => {
  try {
    let resetToken = req.params['token'];
    if (resetToken == null) {
      return res.sendStatus(401).send("token not found")
    }
    const user = jwt.verify(resetToken, process.env.TOKEN_KEY);
    User.findOne({
      _id: user["id"]
    })
      .exec((err, user) => {
        if (err) {
          res.status(500)
            .send({
              message: err
            });
        } else {
          req.user = user;
          next();
        }
      })
  } catch (err) {
    res.send(err);
  }
};
module.exports = resetToken;