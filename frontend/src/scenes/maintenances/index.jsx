import Header from "../../components/Header.jsx";
import {Box, useTheme} from "@mui/material";
import {tokens} from "../../theme.js";
import * as React from "react";
import {useEffect} from "react";
import {observer} from "mobx-react-lite";
import useError from "../../utils/useError.js";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid.jsx";
import maintenancesStore from "../../stores/maintenancesStore.js";
import vehiclesStore from "../../stores/vehiclesStore.js";
import {MaintenanceTypes} from "../../utils/constants.js";
import TopBar from "../global/TopBar.jsx";

const Maintenances = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        {field: 'id', headerName: 'ID'},
        {
            field: 'type', headerName: 'Тип ТО',
            type: 'singleSelect', valueOptions: MaintenanceTypes
        },
        {
            field: 'vehicleId', headerName: 'Транспортний засіб', renderCell: (params) => {
                const vehicle = vehiclesStore.vehicles.find(vehicles => vehicles.id === params.value);
                return vehicle ? vehicle.name : '—';
            }
        },
        {field: 'date', headerName: 'Дата проведення ТО'},
        {field: 'result', headerName: 'Опис робіт'},
    ];

    useEffect(() => {
        if (!maintenancesStore.maintenances.length && !maintenancesStore.loading) maintenancesStore.loadMaintenances();
    }, []);

    useError();

    return (
        <Box m={"20px"}>
            <Box>
                <TopBar headerBox={(
                    <Header title={"ТЕХНІЧНЕ ОБСЛУГОВУВАННЯ"} subtitle={"Керування ТО"}/>
                )}/>
                <Box>
                    <CustomDataGrid columns={columns}
                                    rows={maintenancesStore.maintenances}
                                    addEntityUrl={"/maintenances/create-maintenance"}
                                    editEntityUrl={"/maintenances/edit-maintenance"}
                                    deleteHandler={maintenancesStore.removeMaintenance.bind(maintenancesStore)}

                    ></CustomDataGrid>
                </Box>
            </Box>
        </Box>
    )
        ;
}

export default observer(Maintenances);