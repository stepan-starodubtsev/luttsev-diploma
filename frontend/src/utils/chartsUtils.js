import dayjs from "dayjs";

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
            acc.push({name: displayName, value: 1});
        }
        return acc;
    }, []);
};

export const getLabelFromConstants = (value, constantsArray, valueField = 'value', labelField = 'label') => {
    if (value === null || value === undefined) return 'Не вказано';
    const constant = constantsArray.find(c => c[valueField] === value);
    return constant ? constant[labelField] : String(value);
};

export const aggregateScoresForBarChart = (assessments, scoreTypes, units, personnel, selectedUnitId = null) => {
    if (!assessments || assessments.length === 0) return [];

    // Фільтруємо оцінки за обраним підрозділом, якщо він є
    let filteredAssessments = assessments;
    if (selectedUnitId && personnel && units) {
        const personnelInUnit = personnel
            .filter(p => p.unit_id === selectedUnitId)
            .map(p => p.military_person_id);

        if (personnelInUnit.length === 0 && selectedUnitId !== 'all') { // 'all' - для відображення всіх
            // Якщо в обраному підрозділі немає особового складу, повертаємо порожні дані для цього підрозділу
            return scoreTypes.map(st => ({name: st.label, count: 0, value: st.value}));
        }

        if (selectedUnitId !== 'all') { // Не фільтруємо, якщо вибрано "Всі підрозділи"
            filteredAssessments = assessments.filter(assessment =>
                personnelInUnit.includes(assessment.military_person_id)
            );
        }
    }

    const scoreCounts = scoreTypes.reduce((acc, scoreType) => {
        acc[scoreType.value] = {
            name: scoreType.label, // Використовуємо label для відображення на графіку
            count: 0,
            value: scoreType.value // Зберігаємо оригінальне значення ENUM
        };
        return acc;
    }, {});

    filteredAssessments.forEach(assessment => {
        if (scoreCounts[assessment.score]) {
            scoreCounts[assessment.score].count += 1;
        } else {
            // Обробка невідомих значень score, якщо такі можуть бути
            const unknownScoreKey = 'UNKNOWN';
            if (!scoreCounts[unknownScoreKey]) {
                scoreCounts[unknownScoreKey] = {name: 'Інше/Не вказано', count: 0, value: unknownScoreKey};
            }
            scoreCounts[unknownScoreKey].count += 1;
        }
    });

    return Object.values(scoreCounts);
};

export const POSITIVE_SCORE_VALUES = ['EXCELLENT', 'GOOD', 'PASSED'];

export const aggregatePerformanceByMonth = (assessments, personnel, selectedUnitId = null) => {
    if (!assessments || assessments.length === 0) return [];

    let filteredAssessments = assessments;
    if (selectedUnitId && selectedUnitId !== 'all' && personnel) {
        const personnelInUnit = personnel
            .filter(p => p.unit_id === selectedUnitId)
            .map(p => p.military_person_id);

        if (personnelInUnit.length === 0 && selectedUnitId !== 'all') {
            return []; // Немає даних для цього підрозділу
        }
        if (selectedUnitId !== 'all') {
            filteredAssessments = assessments.filter(assessment =>
                personnelInUnit.includes(assessment.military_person_id)
            );
        }
    }

    if (filteredAssessments.length === 0) return [];

    const monthlyPerformance = {}; // { 'YYYY-MM': { total: 0, positive: 0, percentage: 0 } }

    filteredAssessments.forEach(assessment => {
        const monthYear = dayjs(assessment.assessment_datetime).format('YYYY-MM');
        if (!monthlyPerformance[monthYear]) {
            monthlyPerformance[monthYear] = {total: 0, positive: 0};
        }
        monthlyPerformance[monthYear].total += 1;
        if (POSITIVE_SCORE_VALUES.includes(assessment.score)) {
            monthlyPerformance[monthYear].positive += 1;
        }
    });

    return Object.entries(monthlyPerformance)
        .map(([name, data]) => ({
            name, // 'YYYY-MM'
            monthLabel: dayjs(name).format('MMM YYYY'), // Для відображення, наприклад "Січ 2024"
            percentage: data.total > 0 ? Math.round((data.positive / data.total) * 100) : 0,
            totalAssessments: data.total,
            positiveAssessments: data.positive,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
};