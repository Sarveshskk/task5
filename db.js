const Sequelize = require('sequelize')

const sequelize = new Sequelize('userdb', 'root', '12345', {
    host: 'localhost',
    dialect: 'mysql',
});

try {
    sequelize.authenticate();
    console.log('connected to db..');
} catch (error) {
    console.error('error while connecting..', error);
}
module.exports = sequelize;