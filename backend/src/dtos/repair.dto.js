const {getRepairComponentsByRepairId} = require("../services/RepairComponentService");
const {repairComponentToDto} = require("./repairComponent.dto");

const getRepairComponents = async (repairDTO) => {
    const repairComponents = await getRepairComponentsByRepairId(repairDTO.id);
    return await Promise.all(
        repairComponents.map((repairComponent) => repairComponentToDto(repairComponent))
    );
}

async function repairToDto(repair) {
    const repairDTO = {
        id: repair.id,
        type: repair.type,
        date: repair.date,
        repairReasonText: repair.repairReasonText,
        workDescription: repair.workDescription,
        vehicleId: repair.vehicleId,
        componentRepairs: [],
    };
    repairDTO.componentRepairs = await getRepairComponents(repairDTO);
    return repairDTO;
}

module.exports = {repairToDto};
