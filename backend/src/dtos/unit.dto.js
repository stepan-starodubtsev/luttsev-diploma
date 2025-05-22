function unitToDto(unit) {
    return {
        id: unit.id,
        name: unit.name,
        commanderId: unit.commanderId
    };
}

module.exports = {unitToDto };