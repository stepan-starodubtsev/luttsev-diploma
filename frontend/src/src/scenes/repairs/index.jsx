import Header from "../../components/Header.jsx";
import {Box, useTheme} from "@mui/material";
import {tokens} from "../../theme.js";
import * as React from "react";
import {useEffect} from "react";
import {RepairTypes} from "../../utils/constants.js";
import repairsStore from "../../stores/repairsStore.js";
import {observer} from "mobx-react-lite";
import useError from "../../utils/useError.js";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid.jsx";
import vehiclesStore from "../../stores/vehiclesStore.js";
import TopBar from "../global/TopBar.jsx";

const Repairs = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        {field: 'id', headerName: 'ID'},
        {
            field: 'type', headerName: 'Тип',
            type: 'singleSelect', valueOptions: RepairTypes
        },
        {field: 'date', headerName: 'Дата проведення ремонту', cellClassName: "name-column--cell"},
        {field: 'repairReasonText', headerName: 'Коментар до ремонту'},
        {field: 'workDescription', headerName: 'Причина ремонту'},
        {
            field: 'vehicleId', headerName: 'Транспортний засіб', renderCell: (params) => {
                const vehicle = vehiclesStore.vehicles.find(vehicles => vehicles.id === params.value);
                return vehicle ? vehicle.name : '—';
            }
        },
    ];

    useEffect(() => {
        if (!repairsStore.repairs.length && !repairsStore.loading) repairsStore.loadRepairs();
    }, []);

    useError();

    return (
        <Box sx={{maxWidth: "81vw", m: "20px"}}>
            <TopBar headerBox={(
                <Header title={"РЕМОНТИ ТРАНСПОРТНИХ ЗАСОБІВ"} subtitle={"Керування ремонтами"}/>
            )}/>
            <Box>
                <CustomDataGrid columns={columns}
                                rows={repairsStore.repairs}
                                addEntityUrl={"/repairs/create-repair"}
                                editEntityUrl={"/repairs/edit-repair"}
                                deleteHandler={repairsStore.removeRepair.bind(repairsStore)}

                ></CustomDataGrid>
            </Box>
        </Box>
    )
        ;
}

export default observer(Repairs);