const {DataTypes} = require('sequelize');
const sequelize = require('../config/settingsDB');
const Repair = require('./Repair');
const VehicleComponent = require('./VehicleComponent');

const RepairComponent = sequelize.define('RepairComponent', {
    workDescription: {type: DataTypes.TEXT, allowNull: true}
});

RepairComponent.belongsTo(Repair, {foreignKey: 'repairId'});
RepairComponent.belongsTo(VehicleComponent, {foreignKey: 'vehicleComponentId'});

module.exports = RepairComponent;
