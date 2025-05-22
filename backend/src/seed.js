const sequelize = require('./config/settingsDB');
const bcrypt = require('bcryptjs');

const User = require('./models/ptUser.model');
const Unit = require('./models/ptUnit.model');
const Vehicle = require('./models/sessionExercise.model');
const VehicleComponent = require('./models/standardAssessment.model');
const Repair = require('./models/location.model');
const RepairComponent = require('./models/trainingSession.model');
const Maintenance = require('./models/exercise.model');
const MileageLog = require('./models/militaryPersonnel.model');

const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const generateMilitaryLicensePlate = () => {
    const series = ['АА', 'АС', 'АК', 'ВС', 'ВН', 'ВК', 'СС', 'СН', 'СК', 'НС', 'НК'];
    const numbers = Math.floor(1000 + Math.random() * 9000);
    const suffix = ['ЗСУ', 'НГУ', 'ДПСУ', 'СБУ', 'СЗРУ', 'МОУ'];
    return `${randomChoice(series)}${numbers}${randomChoice(suffix)}`;
};

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min, max) => Math.random() * (max - min) + min;

const generateRandomDate = (start, end) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const randomTime = new Date(startDate + Math.random() * (endDate - startDate));
    return randomTime.toISOString().split('T')[0];
};

const componentTypeToName = (type) => {
    const names = {
        'ENGINE': 'Двигун',
        'GEARBOX': 'Коробка передач',
        'TRANSMISSION': 'Трансмісія',
        'CHASSIS': 'Шасі',
        'BODY': 'Кузов',
        'POWER_SYSTEM': 'Система живлення',
        'COOLING_SYSTEM': 'Система охолодження',
        'BRAKE_SYSTEM': 'Гальмівна система',
        'MONITORING_SYSTEM': 'Система моніторингу',
        'FUEL_SYSTEM': 'Паливна система'
    };
    return names[type] || type;
};

const firstNames = [
    'Іван', 'Петро', 'Олександр', 'Дмитро', 'Володимир', 'Андрій', 'Сергій', 'Михайло', 'Віктор',
    'Юрій', 'Олег', 'Ігор', 'Павло', 'Тарас', 'Богдан', 'Василь', 'Микола', 'Геннадій', 'Олексій',
    'Роман', 'Максим', 'Артем', 'Денис', 'Євген', 'Віталій', 'Анатолій', 'Степан', 'Григорій',
    'Федір', 'Станіслав', 'Владислав', 'Назар', 'Захар', 'Кирило', 'Леонід', 'Артур', 'Вадим',
    'Тимур', 'Руслан', 'Денис', 'Філіп'
];
const middleNames = [
    'Іванович', 'Петрович', 'Олександрович', 'Дмитрович', 'Володимирович', 'Андрійович', 'Сергійович',
    'Михайлович', 'Вікторович', 'Юрійович', 'Олегович', 'Ігорович', 'Павлович', 'Тарасович',
    'Богданович', 'Васильович', 'Миколайович', 'Геннадійович', 'Олексійович', 'Романович',
    'Максимович', 'Артемович', 'Денисович', 'Євгенович', 'Віталійович', 'Анатолійович', 'Степанович',
    'Григорійович', 'Федорович', 'Станіславович', 'Владиславович', 'Назарович', 'Захарович',
    'Кирилович', 'Леонідович', 'Артурович', 'Вадимович', 'Тимурович', 'Русланович', 'Денисович',
    'Філіпович'
];
const lastNames = [
    'Петренко', 'Іванов', 'Сидоренко', 'Коваленко', 'Шевченко', 'Мельник', 'Ткаченко', 'Бондаренко',
    'Коваль', 'Олійник', 'Поліщук', 'Руденко', 'Кравченко', 'Савченко', 'Ковальчук', 'Бойко',
    'Шевчук', 'Діденко', 'Марчук', 'Лисенко', 'Павленко', 'Бондар', 'Кучер', 'Мороз', 'Клименко',
    'Григоренко', 'Федорченко', 'Стахів', 'Владиченко', 'Назаренко', 'Захарченко', 'Кириленко',
    'Леоненко', 'Артушенко', 'Вадименко', 'Тимуренко', 'Русланенко', 'Денисенко', 'Філіпенко',
    'Вовк', 'Заєць', 'Сорока', 'Шульга', 'Литвин', 'Гнатюк', 'Дяченко', 'Романенко', 'Сергієнко'
];

const generateUkrainianName = () => {
    const firstName = randomChoice(firstNames);
    const middleName = randomChoice(middleNames);
    const lastName = randomChoice(lastNames);
    return `${lastName} ${firstName} ${middleName}`;
};

const unitTypes = ['Батальйон', 'Рота', 'Взвод', 'Дивізіон'];
const unitPrefixes = ['1-й', '2-й', '3-й', '4-й', '5-й'];
const unitSpecializations = ['механізований', 'танковий', 'артилерійський', 'зенітний',
    'інженерний', 'логістики', 'ремонтний', 'транспортний'];

const generateUnitName = (index) => {
    const type = randomChoice(unitTypes);
    const prefix = randomChoice(unitPrefixes);
    const specialization = randomChoice(unitSpecializations);

    if (type === 'Взвод') {
        return `${prefix} ${type}`;
    } else if (type === 'Рота') {
        return `${prefix} ${type} ${randomChoice(['забезпечення', 'охорони', specialization])}`;
    } else if (type === 'Батальйон') {
        return `${prefix} ${specialization} ${type}`;
    } else if (type === 'Дивізіон') {
        return `${prefix} ${specialization} ${type}`;
    }

    return `${prefix} ${type} (${index + 1})`;
};

const vehicleModels = {
    CAR: ['УАЗ-469', 'ЛуАЗ-1302', 'Нива (ВАЗ-2121)', 'Pickup Truck'],
    BUS: ['Богдан А092 (військова модифікація)', 'ПАЗ (військова модифікація)', 'КАВЗ (військова модифікація)'],
    TRUCK: ['КрАЗ-6322', 'КрАЗ-260', 'МАЗ-537', 'Урал-4320', 'ГАЗ-66', 'ЗІЛ-131',
        'КАМАЗ-4310', 'TATRA-815', 'M939 (Five-ton truck)'],
};

const getRealisticVehicleName = (type) => {
    const models = vehicleModels[type];
    if (!models || models.length === 0) {
        return `Техніка типу ${type}`;
    }
    return randomChoice(models);
};

const seedDatabase = async () => {
    try {
        console.log('Clearing existing data...');
        await RepairComponent.destroy({where: {}, force: true});
        await Repair.destroy({where: {}, force: true});
        await Maintenance.destroy({where: {}, force: true});
        await MileageLog.destroy({where: {}, force: true});
        await VehicleComponent.destroy({where: {}, force: true});
        await Vehicle.destroy({where: {}, force: true});
        await Unit.destroy({where: {}, force: true});

        await User.destroy({
            where: {
                role: ['COMMANDER', 'DUTY_STAFF', 'ADMIN', 'UNIT_COMMANDER']
            }
        });
        console.log('Existing data cleared.');

        console.log('Starting database seeding...');

        console.log('Creating users...');
        const passwordHash = await bcrypt.hash('testpassword', 10);

        const commanderUser = await User.create({
            name: generateUkrainianName(),
            username: 'commander_main',
            passwordHash: passwordHash,
            role: 'COMMANDER'
        });

        const dutyUser = await User.create({
            name: generateUkrainianName(),
            username: 'duty_park',
            passwordHash: passwordHash,
            role: 'DUTY_STAFF'
        });

        const adminUser = await User.create({
            name: generateUkrainianName(),
            username: 'admin_user',
            passwordHash: passwordHash,
            role: 'ADMIN'
        });

        const unitCommanders = [];
        for (let i = 1; i <= 4; i++) {
            const commander = await User.create({
                name: generateUkrainianName(),
                username: `unit_commander_${i}`,
                passwordHash: passwordHash,
                role: 'UNIT_COMMANDER'
            });
            unitCommanders.push(commander);
        }
        console.log('Users created.');

        console.log('Creating units...');
        const units = [];
        for (let i = 0; i < 4; i++) {
            const unit = await Unit.create({
                name: generateUnitName(i),
                commanderId: unitCommanders[i].id
            });
            units.push(unit);
        }
        console.log('Units created.');

        console.log('Creating vehicles...');
        const vehicles = [];
        const vehicleTypes = ['CAR', 'BUS', 'TRUCK'];
        const fuelTypes = ['A-80', 'A-92', 'A-95', 'A-98', 'DIESEL'];
        const oilTypes = ['M-10G2k', 'M-8G2k/M-10G2k', 'M-10G2k/M-10DM', '10W-40', '15W-40'];
        const operationGroups = ['COMBAT', 'DRILL', 'TRAINING', 'RESERVE'];
        const currentYear = new Date().getFullYear();

        const startOfManufactureRange = new Date('1980-01-01');
        const endOfManufactureRange = new Date(currentYear - 2, 11, 31);

        for (let i = 1; i <= 20; i++) {
            const assignedUnit = units[i % 4];
            const vehicleType = randomChoice(vehicleTypes);
            const vehicleName = getRealisticVehicleName(vehicleType);

            const manufacturedAt = generateRandomDate(startOfManufactureRange, endOfManufactureRange);

            const vehicle = await Vehicle.create({
                name: vehicleName,
                type: vehicleType,
                licensePlate: generateMilitaryLicensePlate(),
                manufacturerNumber: generateRandomString(12),
                manufacturedAt: manufacturedAt,
                operationGroup: randomChoice(operationGroups),
                mileageSinceManufactured: randomFloat(5000, 500000),
                annualResourceNorm: randomFloat(15000, 80000),
                fuelType: randomChoice(fuelTypes),
                oilType: randomChoice(oilTypes),
                unitId: assignedUnit.id
            });
            vehicles.push(vehicle);
        }
        console.log('Vehicles created.');

        console.log('Creating vehicle components...');
        const componentTypes = [
            'ENGINE', 'GEARBOX', 'TRANSMISSION', 'CHASSIS', 'BODY',
            'POWER_SYSTEM', 'COOLING_SYSTEM', 'BRAKE_SYSTEM', 'MONITORING_SYSTEM', 'FUEL_SYSTEM'
        ];
        const conditionCategories = ['1', '2', '3', '4', '5'];

        const vehicleComponents = [];
        for (const vehicle of vehicles) {
            const vehicleManufactureDate = new Date(vehicle.manufacturedAt);
            const manufacturedAt = generateRandomDate(vehicleManufactureDate, new Date());

            for (const componentType of componentTypes) {
                const mileageSinceManufactured = randomFloat(0, vehicle.mileageSinceManufactured * randomFloat(0.5, 1.1));
                const mileageAfterLastRepair = randomFloat(0, Math.min(mileageSinceManufactured, randomFloat(1000, 30000)));

                const component = await VehicleComponent.create({
                    name: componentTypeToName(componentType) + ' (' + vehicle.name.split(' ')[0] + ')',
                    componentType: componentType,
                    manufacturerNumber: generateRandomString(15),
                    manufacturedAt: manufacturedAt,
                    mileageSinceManufactured: mileageSinceManufactured,
                    mileageAfterLastRepair: mileageAfterLastRepair,
                    annualResourceNorm: randomFloat(5000, 40000),
                    maxResource: randomFloat(50000, 300000),
                    conditionCategory: randomChoice(conditionCategories),
                    vehicleId: vehicle.id
                });
                vehicleComponents.push(component);
            }
        }
        console.log('Vehicle components created.');

        console.log('Creating repairs...');
        const repairTypes = ['unplanned', 'current', 'medium', 'capital'];
        const repairs = [];
        const startOfCurrentYear = new Date(currentYear, 0, 1);
        const endOfCurrentYear = new Date(currentYear, 11, 31);


        for (const vehicle of vehicles) {
            const numRepairs = randomInt(1, 3);

            for (let i = 0; i < numRepairs; i++) {
                const repairDate = generateRandomDate(startOfCurrentYear, endOfCurrentYear);
                const repair = await Repair.create({
                    type: randomChoice(repairTypes),
                    date: repairDate,
                    repairReasonText: `Виявлено несправність під час експлуатації (тестова причина ${i + 1})`,
                    workDescription: null,
                    vehicleId: vehicle.id
                });
                repairs.push(repair);

                const numRepairComponents = randomInt(1, 3);
                const componentsForVehicle = vehicleComponents.filter(comp => comp.vehicleId === vehicle.id);
                const selectedComponents = [];
                const componentsCopy = [...componentsForVehicle];
                for(let j = 0; j < numRepairComponents && componentsCopy.length > 0; j++) {
                    const randomIndex = randomInt(0, componentsCopy.length - 1);
                    selectedComponents.push(componentsCopy.splice(randomIndex, 1)[0]);
                }

                for(const component of selectedComponents) {
                    await RepairComponent.create({
                        workDescription: null,
                        repairId: repair.id,
                        vehicleComponentId: component.id
                    });
                }
            }
        }
        console.log('Repairs and RepairComponents created.');

        console.log('Creating maintenances...');
        const maintenanceTypes = ['TO1', 'TO2', 'SO'];

        for (const vehicle of vehicles) {
            for (const maintType of maintenanceTypes) {
                for (let i = 0; i < 3; i++) {
                    const maintenanceDate = generateRandomDate(startOfCurrentYear, endOfCurrentYear);
                    await Maintenance.create({
                        type: maintType,
                        date: maintenanceDate,
                        result: null,
                        vehicleId: vehicle.id
                    });
                }
            }
        }
        console.log('Maintenances created.');

        console.log('Creating mileage logs...');
        for (const vehicle of vehicles) {
            const numLogs = randomInt(2, 7);
            let currentMileage = vehicle.mileageSinceManufactured;
            let lastLogDate = new Date(vehicle.manufacturedAt);
            const logsForVehicle = [];

            for (let i = 0; i < numLogs; i++) {
                const logDate = generateRandomDate(lastLogDate, new Date());

                const mileageIncrease = randomFloat(10, 500);
                const newMileage = currentMileage + mileageIncrease;

                logsForVehicle.push({
                    date: logDate,
                    mileage: newMileage,
                    mileageDifference: mileageIncrease,
                    vehicleId: vehicle.id
                });

                currentMileage = newMileage;
                lastLogDate = new Date(logDate);
            }

            logsForVehicle.sort((a, b) => new Date(a.date) - new Date(b.date));

            for (let i = 0; i < logsForVehicle.length; i++) {
                if (i > 0) {
                    logsForVehicle[i].mileageDifference = Math.max(0, logsForVehicle[i].mileage
                        - logsForVehicle[i - 1].mileage);
                } else {
                    logsForVehicle[i].mileageDifference = Math.max(0, logsForVehicle[i].mileage
                        - vehicle.mileageSinceManufactured);
                }
            }

            await MileageLog.bulkCreate(logsForVehicle);
        }
        console.log('Mileage logs created.');

        console.log('Database seeding completed successfully!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await sequelize.close();
        console.log('Database connection closed.');
    }
};

seedDatabase();