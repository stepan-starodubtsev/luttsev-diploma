import React from 'react';
import {observer} from 'mobx-react-lite';
import {Typography, useTheme} from '@mui/material';
import StatBox from '../StatBox/StatBox.jsx';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import vehiclesStore from '../../../stores/vehiclesStore';
import {tokens} from "../../../theme";

const TotalVehiclesStat = observer(() => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    if (vehiclesStore.loading) {
        return <Typography variant="caption">Завантаження...</Typography>;
    }

    return (
        <StatBox
            title="Всього ТЗ"
            value={vehiclesStore.vehicles.length}
            icon={<DirectionsCarIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
        />
    );
});

export default TotalVehiclesStat;