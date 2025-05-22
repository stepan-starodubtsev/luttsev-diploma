import React from 'react';
import {observer} from 'mobx-react-lite';
import {Typography, useTheme} from '@mui/material';
import StatBox from '../StatBox/StatBox.jsx';
import SpeedIcon from '@mui/icons-material/Speed';
import mileageLogsStore from '../../../stores/mileageLogsStore';
import {isDateInCurrentMonth} from '../../../utils/chartsUtils.js';
import {tokens} from "../../../theme";

const MonthlyMileageStat = observer(() => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    if (mileageLogsStore.loading) {
        return <Typography variant="caption">Завантаження...</Typography>;
    }

    const monthlyMileageLogs = mileageLogsStore.mileageLogs.filter(log => isDateInCurrentMonth(log.date));

    const totalMonthlyMileage = monthlyMileageLogs.reduce((sum, log) => {
        const difference = parseFloat(log.mileageDifference);
        return sum + (isNaN(difference) ? 0 : difference);
    }, 0);

    return (
        <StatBox
            title="Пробіг (місяць)"
            value={`${totalMonthlyMileage.toLocaleString()} км`}
            icon={<SpeedIcon sx={{ color: colors.purpleAccent ? colors.purpleAccent[500] : '#9C27B0', fontSize: "26px" }} />}
        />
    );
});

export default MonthlyMileageStat;