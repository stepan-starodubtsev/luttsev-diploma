function mileageLogToDto(mileageLog) {
    return {
        id: mileageLog.id,
        vehicleId: mileageLog.vehicleId,
        date: mileageLog.date,
        mileage: mileageLog.mileage,
        mileageDifference: mileageLog.mileageDifference,
    };
}

module.exports = { mileageLogToDto };
