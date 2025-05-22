export const isDateInCurrentMonth = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
};

export const aggregateDataForPieChart = (items, keyField, constantsArray) => {
    if (!items || items.length === 0) return [];
    return items.reduce((acc, item) => {
        const rawValue = item[keyField];
        const displayName = constantsArray
            ? getLabelFromConstants(rawValue, constantsArray)
            : (rawValue || 'Не вказано');

        const existing = acc.find(d => d.name === displayName);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: displayName, value: 1 });
        }
        return acc;
    }, []);
};

export const getLabelFromConstants = (value, constantsArray, valueField = 'value', labelField = 'label') => {
    if (value === null || value === undefined) return 'Не вказано';
    const constant = constantsArray.find(c => c[valueField] === value);
    return constant ? constant[labelField] : String(value);
};