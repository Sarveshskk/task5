const jwt = require("jsonwebtoken");
const dbops = require("../models/index");
const User = dbops.User;
require("dotenv").config();
const verifyToken = async (req, res,next) => {
  try{
    let token = req.headers['jwttoken'];
    if (token == null) return res.sendStatus(401)
    const user = jwt.verify(token, process.env.TOKEN_KEY);
    let userData =await User.findOne({
      where: {
        id: user['id'],
      }
    });
    if(userData){ 
      req.user = user;
        next();
    }else{
      res.send("unauthorised! please login first")
    }
  }catch(err){
      res.send(err)
  }     
};

module.exports = verifyToken;



// manually token verify
// const verifyToken = (req, res,next) => {
//     let token_id = req.headers['token'];
//     Token.findOne({ _id:token_id }, (err, foundToken) => {
//         if (err) {
//             console.log(err);
//         } else {
//             if (foundToken) {
//                 User.findOne({_id:foundToken.user_id},(err, foundUser) => {
//                     if (err) {
//                         console.log(err);
//                     }else{
//                         if(foundUser){
//                             req.user = foundUser;
//                             next();
//                         }else{
//                             res.status(500).send("unauthorised user");
//                         }
//                     }
//                 });

//             }else{
//                 res.status(500).send("unauthorised token");
//             }
//         }
   
// });
// };


