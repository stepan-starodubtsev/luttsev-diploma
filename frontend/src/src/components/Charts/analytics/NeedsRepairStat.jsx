import React from 'react';
import {observer} from 'mobx-react-lite';
import {Typography, useTheme} from '@mui/material';
import StatBox from '../StatBox/StatBox.jsx';
import BuildIcon from '@mui/icons-material/Build';
import vehiclesStore from '../../../stores/vehiclesStore';
import {tokens} from "../../../theme";

const NeedsRepairStat = observer(() => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    if (vehiclesStore.loading) {
        return <Typography variant="caption">Завантаження...</Typography>;
    }

    const needsRepairCount = vehiclesStore.vehicles.filter(v => v.needsCapitalRepair).length;

    return (
        <StatBox
            title="Потребують ремонту"
            value={needsRepairCount}
            icon={<BuildIcon sx={{ color: colors.redAccent ? colors.redAccent[500] : '#F44336', fontSize: "26px" }} />}
        />
    );
});

export default NeedsRepairStat;