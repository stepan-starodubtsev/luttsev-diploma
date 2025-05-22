function repairComponentToDto(entry) {
    return {
        id: entry.id,
        repairId: entry.repairId,
        vehicleComponentId: entry.vehicleComponentId,
        workDescription: entry.workDescription
    };
}

module.exports = { repairComponentToDto };