import React from 'react';
import {observer} from 'mobx-react-lite';
import GenericPieChart from './GenericPieChart';
import vehiclesStore from '../../stores/vehiclesStore';
import {aggregateDataForPieChart} from '../../utils/chartsUtils.js';
import {VehicleTypes} from '../../utils/constants.js';
import {Typography} from '@mui/material';

const VehicleTypePieChart = observer(() => {
    if (vehiclesStore.loading) {
        return <Typography>Завантаження видів ТЗ...</Typography>;
    }
    const chartData = aggregateDataForPieChart(vehiclesStore.vehicles, 'type', VehicleTypes);

    return <GenericPieChart title="Види ТЗ" data={chartData} />;
});

export default VehicleTypePieChart;