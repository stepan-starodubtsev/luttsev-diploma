const {getVehicleComponentsByVehicleId} = require("../services/VehicleComponentService");
const {getMileagesLogsByVehicleIdForThisYear} = require("../services/MileageLogService");
const {vehicleComponentToDto} = require("./vehicleComponent.dto");

const calculateAnnualResourceActual = async (vehicle) => {
    const logs = await getMileagesLogsByVehicleIdForThisYear(vehicle.id);
    if (logs) {
        if (logs.length < 2) {
            if (logs.length === 1) {
                return logs[0].mileageDifference;
            }
        }
    } else {
        return 0;
    }

    return logs.reduce((accumulator, currentLog) => {
        return accumulator + currentLog.mileageDifference;
    }, 0);
}

const getVehicleComponents = async (vehicleDTO) => {
    const components = await getVehicleComponentsByVehicleId(vehicleDTO.id);
    return await Promise.all(
        components.map((vehicleComponent) => vehicleComponentToDto(vehicleComponent))
    );
}

const getConditionCategory = (vehicle) => {
    const vehicleComponentsCategories = vehicle.components.map((vehicleComponent) => {
        return vehicleComponent.conditionCategory
    });

    return vehicleComponentsCategories.sort((a, b) => {
        b - a
    })[0];
}


const getNeedsMaintenance = (vehicle) => {
    return vehicle.components.some((vehicleComponent) => {
        return vehicleComponent.needsMaintenance
    });
};

const getNeedsCapitalRepair = (vehicle) => {
    return vehicle.components.some((vehicleComponent) => {
        return vehicleComponent.needsCapitalRepair
    });
};

const getRemainingResourceToNextRepair = (vehicle) => {
    const vehicleComponentsRemainingResources = vehicle.components.map((vehicleComponent) => {
        return vehicleComponent.remainingResourceToNextRepair
    });

    return vehicleComponentsRemainingResources.sort((a, b) => a - b)[0];

}

async function vehicleToDto(vehicle) {

    const vehicleDTO = {
        id: vehicle.id,
        name: vehicle.name,
        type: vehicle.type,
        licensePlate: vehicle.licensePlate,
        manufacturerNumber: vehicle.manufacturerNumber,
        manufacturedAt: vehicle.manufacturedAt,
        operationGroup: vehicle.operationGroup,
        mileageSinceManufactured: vehicle.mileageSinceManufactured,
        annualResourceNorm: vehicle.annualResourceNorm,
        annualResourceActual: null,
        remainingAnnualResource: null,
        remainingResourceToNextRepair: null,
        conditionCategory: "",
        fuelType: vehicle.fuelType,
        oilType: vehicle.oilType,
        needsMaintenance: false,
        needsCapitalRepair: false,
        components: [],
        unitId: vehicle.unitId,
    };
    vehicleDTO.components = await getVehicleComponents(vehicleDTO);
    vehicleDTO.annualResourceActual = await calculateAnnualResourceActual(vehicleDTO);
    vehicleDTO.remainingAnnualResource = vehicleDTO.annualResourceNorm - vehicleDTO.annualResourceActual;
    vehicleDTO.remainingResourceToNextRepair = getRemainingResourceToNextRepair(vehicleDTO);
    vehicleDTO.conditionCategory = getConditionCategory(vehicleDTO);
    vehicleDTO.needsMaintenance = getNeedsMaintenance(vehicleDTO)
        || vehicleDTO.annualResourceActual > vehicleDTO.annualResourceNorm;
    vehicleDTO.needsCapitalRepair = getNeedsCapitalRepair(vehicleDTO);

    return vehicleDTO;
}

module.exports = {vehicleToDto};