const {getMileagesLogsByVehicleIdForThisYear} = require("../services/MileageLogService");

const calculateAnnualResourceActual = async (component) => {
    const logs = await getMileagesLogsByVehicleIdForThisYear(component.vehicleId);

    if (!logs || logs.length === 0) {
        return 0;
    }

    if (logs.length === 1) {
        return logs[0].mileageDifference;
    }

    return logs.reduce((accumulator, currentLog) => {
        return accumulator + currentLog.mileageDifference;
    }, 0);
};


async function vehicleComponentToDto(component) {

    const vehicleComponentDTO = {
        id: component.id,
        name: component.name,
        componentType: component.componentType,
        manufacturerNumber: component.manufacturerNumber,
        manufacturedAt: component.manufacturedAt,
        mileageSinceManufactured: component.mileageSinceManufactured,
        mileageAfterLastRepair: component.mileageAfterLastRepair,
        annualResourceNorm: component.annualResourceNorm,
        annualResourceActual: null,
        remainingAnnualResource: null,
        remainingResourceToNextRepair: null,
        conditionCategory: component.conditionCategory,
        maxResource: component.maxResource,
        needsMaintenance: false,
        needsCapitalRepair: false,
        vehicleId: component.vehicleId,
    };
    vehicleComponentDTO.annualResourceActual = await calculateAnnualResourceActual(component);
    vehicleComponentDTO.remainingAnnualResource = vehicleComponentDTO.annualResourceNorm - vehicleComponentDTO.annualResourceActual;
    vehicleComponentDTO.remainingResourceToNextRepair = vehicleComponentDTO.maxResource - vehicleComponentDTO.mileageAfterLastRepair;
    vehicleComponentDTO.needsMaintenance =
        vehicleComponentDTO.annualResourceActual > vehicleComponentDTO.annualResourceNorm;
    vehicleComponentDTO.needsCapitalRepair =
        vehicleComponentDTO.mileageSinceManufactured > vehicleComponentDTO.maxResource;
    if (vehicleComponentDTO.needsCapitalRepair) {
        vehicleComponentDTO.conditionCategory = '4';
    }

    return vehicleComponentDTO;
}


module.exports = {vehicleComponentToDto};