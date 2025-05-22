const {DataTypes} = require('sequelize');
const sequelize = require('../config/settingsDB');
const Vehicle = require('./Vehicle');

const MileageLog = sequelize.define('MileageLog', {
    date: {type: DataTypes.DATEONLY, allowNull: false},
    mileage: {type: DataTypes.FLOAT, allowNull: false},
    mileageDifference: {type: DataTypes.FLOAT, allowNull: false},
});

MileageLog.belongsTo(Vehicle, {foreignKey: 'vehicleId'});

module.exports = MileageLog;