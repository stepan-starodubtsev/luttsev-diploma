// frontend/src/src/components/Charts/SessionTypePieChart.jsx
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import GenericPieChart from './GenericPieChart.jsx'; // Переконайтесь, що шлях правильний
import trainingSessionStore from '../../stores/trainingSessionStore';
import { aggregateDataForPieChart } from '../../utils/chartsUtils.js'; //
import { SessionTypes } from '../../utils/constants.js'; //
import { Typography } from '@mui/material';

const SessionTypePieChart = observer(() => {
    useEffect(() => {
        if (trainingSessionStore.sessions.length === 0 && !trainingSessionStore.loading) {
            trainingSessionStore.loadSessions();
        }
    }, []);

    if (trainingSessionStore.loading && trainingSessionStore.sessions.length === 0) {
        return <Typography>Завантаження типів занять...</Typography>;
    }

    const chartData = aggregateDataForPieChart(
        trainingSessionStore.sessions,
        'session_type', // Поле в об'єкті сесії, за яким агрегуємо
        SessionTypes      // Масив констант для отримання міток (label)
    );

    return <GenericPieChart title="Розподіл занять за типами" data={chartData} />;
});

export default SessionTypePieChart;