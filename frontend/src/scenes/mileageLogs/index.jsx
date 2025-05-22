import Header from "../../components/Header.jsx";
import {Box, useTheme} from "@mui/material";
import {tokens} from "../../theme.js";
import * as React from "react";
import {useEffect} from "react";
import {observer} from "mobx-react-lite";
import useError from "../../utils/useError.js";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid.jsx";
import mileageLogsStore from "../../stores/mileageLogsStore.js";
import vehiclesStore from "../../stores/vehiclesStore.js";
import TopBar from "../global/TopBar.jsx";

const MileageLogs = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        {field: 'id', headerName: 'ID'},
        {
            field: 'vehicleId', headerName: 'Транспортний засіб', renderCell: (params) => {
                const vehicle = vehiclesStore.vehicles.find(vehicles => vehicles.id === params.value);
                return vehicle ? vehicle.name : '—';
            }
        },
        {field: 'date', headerName: 'Дата проведення ТО'},
        {field: 'mileage', headerName: 'Пробіг на момент запису'},
        {field: 'mileageDifference', headerName: 'Використаний ресурс'},
    ];

    useEffect(() => {
        if (!mileageLogsStore.mileageLogs.length && !mileageLogsStore.loading) mileageLogsStore.loadMileageLogs();
    }, []);

    useError();

    return (
        <Box m={"20px"}>
            <TopBar headerBox={(
                <Header title={"ЗВІТИ ПРО ПРОБІГ"} subtitle={"Керування звітами про пробіг транспортних засобів"}/>
            )}/>
            <Box>
                <CustomDataGrid columns={columns}
                                rows={mileageLogsStore.mileageLogs}
                                addEntityUrl={"/mileage-logs/create-mileage-log"}
                                deleteHandler={mileageLogsStore.removeMileageLog.bind(mileageLogsStore)}

                ></CustomDataGrid>
            </Box>
        </Box>
    )
        ;
}

export default observer(MileageLogs);