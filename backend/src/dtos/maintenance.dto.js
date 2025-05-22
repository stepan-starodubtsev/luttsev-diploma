function maintenanceToDto(maintenance) {
    return {
        id: maintenance.id,
        vehicleId: maintenance.vehicleId,
        type: maintenance.type,
        date: maintenance.date,
        result: maintenance.result,
    };
}

module.exports = { maintenanceToDto };