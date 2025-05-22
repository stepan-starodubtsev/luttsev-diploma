import React from 'react';
import {observer} from 'mobx-react-lite';
import {Typography, useTheme} from '@mui/material';
import StatBox from '../StatBox/StatBox.jsx';
import ConstructionIcon from '@mui/icons-material/Construction';
import repairsStore from '../../../stores/repairsStore';
import {isDateInCurrentMonth} from '../../../utils/chartsUtils.js';
import {tokens} from "../../../theme";

const RepairsThisMonthStat = observer(() => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    if (repairsStore.loading) {
        return <Typography variant="caption">Завантаження...</Typography>;
    }

    const repairsThisMonth = repairsStore.repairs.filter(repair => isDateInCurrentMonth(repair.date)).length;

    return (
        <StatBox
            title="Ремонти (місяць)"
            value={repairsThisMonth}
            icon={<ConstructionIcon sx={{ color: colors.blueAccent ? colors.blueAccent[500] : '#2196F3', fontSize: "26px" }} />}
        />
    );
});

export default RepairsThisMonthStat;