// frontend/src/src/utils/constants.js

export const BASE_URL = import.meta.env.VITE_BASE_URL;

// ОНОВЛЕНІ РОЛІ
export const ROLES = {
    ADMIN: 'ADMIN',
    COMMANDER: 'COMMANDER',
    DEPARTMENT_EMPLOYEE: 'DEPARTMENT_EMPLOYEE',
    INSTRUCTOR: 'INSTRUCTOR'
};

export const UserRolesDisplay = [
    { label: 'Адміністратор', value: ROLES.ADMIN },
    { label: 'Командир', value: ROLES.COMMANDER },
    { label: 'Працівник навч. відділу', value: ROLES.DEPARTMENT_EMPLOYEE },
    { label: 'Інструктор', value: ROLES.INSTRUCTOR }
];

export const SessionTypes = [
    { label: 'Тренування', value: 'TRAINING' },
    { label: 'Здача нормативів', value: 'STANDARDS_ASSESSMENT' },
    { label: 'Заняття підрозділу', value: 'UNIT_TRAINING' }
];

export const ScoreTypes = [
    { label: 'Зараховано', value: 'PASSED' },
    { label: 'Відмінно', value: 'EXCELLENT' },
    { label: 'Добре', value: 'GOOD' },
    { label: 'Задовільно', value: 'SATISFACTORY' },
    { label: 'Не зараховано', value: 'FAILED' }
];
