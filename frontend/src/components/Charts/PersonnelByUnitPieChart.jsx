// frontend/src/src/components/Charts/PersonnelByUnitPieChart.jsx
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import GenericPieChart from './GenericPieChart.jsx';
import militaryPersonnelStore from '../../stores/militaryPersonnelStore';
import unitStore from '../../stores/unitStore.js'; // Потрібен для отримання назв підрозділів
import { aggregateDataForPieChart } from '../../utils/chartsUtils.js';
import { Typography } from '@mui/material';

const PersonnelByUnitPieChart = observer(() => {
    useEffect(() => {
        if (militaryPersonnelStore.personnelList.length === 0 && !militaryPersonnelStore.loading) {
            militaryPersonnelStore.loadPersonnel(); // loadPersonnel вже має завантажувати unitStore
        }
        if (unitStore.units.length === 0 && !unitStore.loading && militaryPersonnelStore.personnelList.length > 0) {
            // Додатково завантажуємо підрозділи, якщо вони не завантажились через personnelStore
            unitStore.loadUnits();
        }
    }, []);

    if ((militaryPersonnelStore.loading && militaryPersonnelStore.personnelList.length === 0) || (unitStore.loading && unitStore.units.length === 0)) {
        return <Typography>Завантаження розподілу особового складу...</Typography>;
    }

    // Створюємо масив для constantsArray з назвами підрозділів
    const unitConstants = unitStore.units.map(unit => ({
        value: unit.unit_id, // ID підрозділу
        label: unit.unit_name // Назва підрозділу
    }));

    const chartData = aggregateDataForPieChart(
        militaryPersonnelStore.personnelList,
        'unit_id',      // Поле в об'єкті MilitaryPersonnel, за яким агрегуємо
        unitConstants   // Масив з назвами підрозділів
    );

    return <GenericPieChart title="Особовий склад за підрозділами" data={chartData} />;
});

export default PersonnelByUnitPieChart;