import React from 'react';
import {observer} from 'mobx-react-lite';
import {Typography, useTheme} from '@mui/material';
import StatBox from '../StatBox/StatBox.jsx';
import EventNoteIcon from '@mui/icons-material/EventNote';
import maintenancesStore from '../../../stores/maintenancesStore';
import {isDateInCurrentMonth} from '../../../utils/chartsUtils.js';
import {tokens} from "../../../theme";

const MaintenancesThisMonthStat = observer(() => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    if (maintenancesStore.loading) {
        return <Typography variant="caption">Завантаження...</Typography>;
    }

    const maintenancesThisMonth = maintenancesStore.maintenances.filter(maint => isDateInCurrentMonth(maint.date)).length;

    return (
        <StatBox
            title="Обслуговування (місяць)"
            value={maintenancesThisMonth}
            icon={<EventNoteIcon sx={{ color: colors.tealAccent ? colors.tealAccent[500] : '#009688', fontSize: "26px" }} />}
        />
    );
});

export default MaintenancesThisMonthStat;