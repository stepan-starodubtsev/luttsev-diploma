import React from 'react';
import {observer} from 'mobx-react-lite';
import {Typography, useTheme} from '@mui/material';
import StatBox from '../StatBox/StatBox.jsx';
import EngineeringIcon from '@mui/icons-material/Engineering';
import vehiclesStore from '../../../stores/vehiclesStore';
import {tokens} from "../../../theme";

const NeedsMaintenanceStat = observer(() => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    if (vehiclesStore.loading) {
        return <Typography variant="caption">Завантаження...</Typography>;
    }

    const needsMaintenanceCount = vehiclesStore.vehicles.filter(v => v.needsMaintenance).length;

    return (
        <StatBox
            title="Потребують ТО"
            value={needsMaintenanceCount}
            icon={<EngineeringIcon sx={{ color: colors.orangeAccent ? colors.orangeAccent[500] : '#FF9800', fontSize: "26px" }} />}
        />
    );
});

export default NeedsMaintenanceStat;