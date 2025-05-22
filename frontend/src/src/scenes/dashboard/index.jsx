import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import Header from "../../components/Header.jsx";
import {Box, Grid, useTheme} from "@mui/material";
import {tokens} from "../../theme.js";

import vehiclesStore from '../../stores/vehiclesStore.js';
import repairsStore from '../../stores/repairsStore.js';
import maintenancesStore from '../../stores/maintenancesStore.js';

import VehicleTypePieChart from '../../components/Charts/VehicleTypePieChart.jsx';
import VehicleFuelTypePieChart from '../../components/Charts/VehicleFuelTypePieChart.jsx';
import VehicleOilTypePieChart from '../../components/Charts/VehicleOilTypePieChart.jsx';
import VehicleOperationGroupPieChart from '../../components/Charts/VehicleOperationGroupPieChart.jsx';
import TotalVehiclesStat from "../../components/Charts/analytics/TotalVehiclesStat.jsx";
import NeedsRepairStat from "../../components/Charts/analytics/NeedsRepairStat.jsx";
import NeedsMaintenanceStat from "../../components/Charts/analytics/NeedsMaintenanceStat.jsx";
import RepairsThisMonthStat from "../../components/Charts/analytics/RepairsThisMonthStat.jsx";
import MaintenancesThisMonthStat from "../../components/Charts/analytics/MaintenancesThisMonthStat.jsx";
import MonthlyMileageStat from "../../components/Charts/analytics/MonthlyMileageStat.jsx";
import TopBar from "../global/TopBar.jsx";
import mileageLogsStore from "../../stores/mileageLogsStore.js";

const Dashboard = observer(() => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        if (!vehiclesStore.vehicles.length && !vehiclesStore.loading) vehiclesStore.loadVehicles();
        if (!mileageLogsStore.mileageLogs.length && !mileageLogsStore.loading) mileageLogsStore.loadMileageLogs();
        if (!repairsStore.repairs.length && !repairsStore.loading) repairsStore.loadRepairs();
        if (!maintenancesStore.maintenances.length && !maintenancesStore.loading) maintenancesStore.loadMaintenances();
    }, []);

    return (
        <>
            <TopBar headerBox={
                (<Box display="flex" alignItems="center" justifyContent="space-between">
                    <Header title="ГОЛОВНА ПАНЕЛЬ" subtitle="Огляд ключових показників"/>
                </Box>)
            }/>
            <Box m="20px">
                <Grid container spacing={1} mb={2}>
                    <Grid item size={4}>
                        <TotalVehiclesStat/>
                    </Grid>
                    <Grid item size={4}>
                        <NeedsRepairStat/>
                    </Grid>
                    <Grid item size={4}>
                        <NeedsMaintenanceStat/>
                    </Grid>
                    <Grid item size={4}>
                        <MonthlyMileageStat/>
                    </Grid>
                    <Grid item size={4}>
                        <RepairsThisMonthStat/>
                    </Grid>
                    <Grid item size={4}>
                        <MaintenancesThisMonthStat/>
                    </Grid>
                </Grid>

                <Grid container spacing={3} mb={3}>
                    <Grid item size={3}>
                        <VehicleTypePieChart/>
                    </Grid>
                    <Grid item size={3}>
                        <VehicleOperationGroupPieChart/>
                    </Grid>
                    <Grid item size={3}>
                        <VehicleFuelTypePieChart/>
                    </Grid>
                    <Grid item size={3}>
                        <VehicleOilTypePieChart/>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
});

export default Dashboard;