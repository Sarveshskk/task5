const sequelize = require("../db");
const User = require("./users");
const Sequelize = require("sequelize");
const Address = sequelize.define("address", {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    pin_code: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    phone_no: {
        type: Sequelize.BIGINT(11),
        allowNull: false
    },
    user_id: {
        type: Sequelize.BIGINT(11),
        allowNull: false
    },
});
Address.sync();

User.hasMany(Address,{foreignKey:"user_id"});
Address.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });
module.exports = Address;
