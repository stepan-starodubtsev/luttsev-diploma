const {DataTypes} = require('sequelize');
const sequelize = require('../config/settingsDB');
const Vehicle = require('./Vehicle');
const User = require('./User');

const Maintenance = sequelize.define('Maintenance', {
    type: {
        type: DataTypes.ENUM('TO1', 'TO2', 'SO'),
        allowNull: false
    },
    date: {type: DataTypes.DATEONLY, allowNull: false},
    result: {type: DataTypes.TEXT, allowNull: true},
});

Maintenance.belongsTo(Vehicle, {foreignKey: 'vehicleId'});

module.exports = Maintenance;
