const Sequelize = require('sequelize');
const sequelize = new Sequelize('sequelize_shop', 'root', '', {
    dialect: 'mysql'
});

module.exports = sequelize;