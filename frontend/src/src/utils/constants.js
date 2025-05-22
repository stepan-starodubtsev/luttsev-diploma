export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const ROLES = {
    ADMIN: 'ADMIN',
    COMMANDER: 'COMMANDER',
    UNIT_COMMANDER: 'UNIT_COMMANDER',
    DUTY_STAFF: 'DUTY_STAFF'
};

export const UserRoles = [
    {label: 'Адміністратор', value: 'ADMIN'},
    {label: 'Командир частини', value: 'COMMANDER'},
    {label: 'Командир підрозділу', value: 'UNIT_COMMANDER'},
    {label: 'Черговий парку', value: 'DUTY_STAFF'}
];
export const VehicleTypes = [
    {label: 'Автомобіль', value: 'CAR'},
    {label: 'Автобус', value: 'BUS'},
    {label: 'Вантажівка', value: 'TRUCK'}
];
export const OperationGroups = [
    {label: 'Бойова', value: 'COMBAT'},
    {label: 'Стройова', value: 'DRILL'},
    {label: 'Тренувальна', value: 'TRAINING'},
    {label: 'Резерв', value: 'RESERVE'}
];
export const ConditionCategories = [
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4', value: '4'},
    {label: '5', value: '5'}
];

export const FuelTypes = [
    {label: 'A-80', value: 'A-80'},
    {label: 'A-92', value: 'A-92'},
    {label: 'A-95', value: 'A-95'},
    {label: 'A-98', value: 'A-98'},
    {label: 'Дизель', value: 'DIESEL'},
];

export const OilTypes = [
    {label: 'М-10Г2к', value: 'M-10G2k'},
    {label: 'М-8Г2к/М-10Г2к', value: 'M-8G2k/M-10G2k'},
    {label: 'М-10Г2к/М-10ДМ', value: 'M-10G2k/M-10DM'},
    {label: '10W-40', value: '10W-40'},
    {label: '15W-40', value: '15W-40'},
];

export const VehicleComponentTypes = [
    {label: 'Двигун', value: 'ENGINE'},
    {label: 'Коробка передач', value: 'GEARBOX'},
    {label: 'Трансмісія', value: 'TRANSMISSION'},
    {label: 'Ходова частина', value: 'CHASSIS'},
    {label: 'Кузов', value: 'BODY'},
    {label: 'Система електроживлення', value: 'POWER_SYSTEM'},
    {label: 'Система охолодження', value: 'COOLING_SYSTEM'},
    {label: 'Гальмівна система', value: 'BRAKE_SYSTEM'},
    {label: 'Технічні системи контролю та моніторингу', value: 'MONITORING_SYSTEM'},
    {label: 'Паливна система', value: 'FUEL_SYSTEM'},
]

export const RepairTypes = [
    {label: 'Незапланований', value: 'unplanned'},
    {label: 'Поточний', value: 'current'},
    {label: 'Середній', value: 'medium'},
    {label: 'Капітальний', value: 'capital'},
]

export const MaintenanceTypes = [
    {label: 'TO1', value: 'TO1'},
    {label: 'TO2', value: 'TO2'},
    {label: 'Сезонне', value: 'SO'}
]