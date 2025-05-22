const {DataTypes} = require('sequelize');
const sequelize = require('../config/settingsDB');
const Unit = require('./Unit');

const Vehicle = sequelize.define('Vehicle', {
    name: {type: DataTypes.STRING, allowNull: false},
    type: {type: DataTypes.ENUM('CAR', 'BUS', 'TRUCK'), allowNull: false},
    licensePlate: {type: DataTypes.STRING, allowNull: false},
    manufacturerNumber: {type: DataTypes.STRING, allowNull: false},
    manufacturedAt: {type: DataTypes.DATEONLY, allowNull: false},
    operationGroup: {type: DataTypes.ENUM('COMBAT', 'DRILL', 'TRAINING', 'RESERVE'), allowNull: false},
    mileageSinceManufactured: {type: DataTypes.FLOAT, allowNull: false},
    annualResourceNorm: {type: DataTypes.FLOAT, allowNull: false},
    fuelType: {type: DataTypes.ENUM('A-80', 'A-92', 'A-95', 'A-98', 'DIESEL'), allowNull: false},
    oilType: {
        type: DataTypes.ENUM(
            'M-10G2k', 'M-8G2k/M-10G2k', 'M-10G2k/M-10DM', '10W-40', '15W-40'), allowNull: false
    }
});

Vehicle.belongsTo(Unit, {foreignKey: 'unitId'});

module.exports = Vehicle;
