const {DataTypes} = require('sequelize');
const sequelize = require('../config/settingsDB');
const Vehicle = require('./Vehicle');

const VehicleComponent = sequelize.define('VehicleComponent', {
    name: {type: DataTypes.STRING, allowNull: false},
    componentType: {
        type: DataTypes.ENUM(
            'ENGINE',
            'GEARBOX',
            'TRANSMISSION',
            'CHASSIS',
            'BODY',
            'POWER_SYSTEM',
            'COOLING_SYSTEM',
            'BRAKE_SYSTEM',
            'MONITORING_SYSTEM',
            'FUEL_SYSTEM'),
        allowNull: false
    },
    manufacturerNumber: {type: DataTypes.STRING, allowNull: false},
    manufacturedAt: {type: DataTypes.DATEONLY, allowNull: false},
    mileageSinceManufactured: {type: DataTypes.FLOAT, allowNull: false},
    mileageAfterLastRepair: {type: DataTypes.FLOAT, allowNull: false},
    annualResourceNorm: {type: DataTypes.FLOAT, allowNull: false},
    maxResource: {type: DataTypes.FLOAT, allowNull: false},
    conditionCategory: {type: DataTypes.ENUM('1', '2', '3', '4', '5'), allowNull: false}
});

VehicleComponent.belongsTo(Vehicle, {foreignKey: 'vehicleId'});

module.exports = VehicleComponent;
