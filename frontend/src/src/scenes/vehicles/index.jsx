import Header from "../../components/Header.jsx";
import {Box, useTheme} from "@mui/material";
import {tokens} from "../../theme.js";
import * as React from "react";
import {useEffect} from "react";
import {ConditionCategories, FuelTypes, OilTypes, OperationGroups, VehicleTypes} from "../../utils/constants.js";
import vehiclesStore from "../../stores/vehiclesStore.js";
import unitsStore from "../../stores/unitsStore.js";
import {observer} from "mobx-react-lite";
import useError from "../../utils/useError.js";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid.jsx";
import TopBar from "../global/TopBar.jsx";

const Vehicles = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        {field: 'id', headerName: 'ID'},
        {field: 'name', headerName: 'Назва', cellClassName: "name-column--cell"},
        {
            field: 'type', headerName: 'Тип',
            type: 'singleSelect', valueOptions: VehicleTypes
        },
        {field: 'licensePlate', headerName: 'Дорожній номер'},
        {field: 'manufacturerNumber', headerName: 'Заводський номер'},
        {
            field: 'operationGroup', headerName: 'Група експлуатації',
            type: 'singleSelect', valueOptions: OperationGroups
        },
        {
            field: 'conditionCategory', headerName: 'Категорія стану техніки',
            type: 'singleSelect', valueOptions: ConditionCategories
        },
        {
            field: 'fuelType', headerName: 'Тип палива',
            type: 'singleSelect', valueOptions: FuelTypes
        },
        {
            field: 'oilType', headerName: 'Тип моторного мастила',
            type: 'singleSelect', valueOptions: OilTypes
        },
        {field: 'manufacturedAt', headerName: 'Дата виготовлення'},
        {field: 'mileageSinceManufactured', headerName: 'Пробіг з виготовлення'},
        {field: 'annualResourceNorm', headerName: 'Річна норма ресурсу'},
        {field: 'annualResourceActual', headerName: 'Використано ресурсу в цьому році'},
        {field: 'remainingAnnualResource', headerName: 'Залишилося ресурсу в цьому році'},
        {field: 'remainingResourceToNextRepair', headerName: 'Залишилося ресурсу до наступного капітального ремонту'},
        {field: 'needsMaintenance', headerName: 'Потребує ТО', type: 'boolean'},
        {field: 'needsCapitalRepair', headerName: 'Потребує капітального ремонту', type: 'boolean'},
        {
            field: 'unitId', headerName: 'Підрозділ', renderCell: (params) => {
                const unit = unitsStore.units.find(unit => unit.id === params.value);
                return unit ? unit.name : '—';
            }
        },
    ];

    useEffect(() => {
        if (!vehiclesStore.vehicles.length && !vehiclesStore.loading) vehiclesStore.loadVehicles();
    }, []);

    useError();

    return (
        <Box sx={{maxWidth: "81vw", m: "20px"}}>
            <TopBar headerBox={(
                <Header title={"ТРАНСПОРТНІ ЗАСОБИ"} subtitle={"Керування транспортними засобами"}/>
            )}/>
            <Box>
                <CustomDataGrid columns={columns}
                                rows={vehiclesStore.vehicles}
                                addEntityUrl={"/vehicles/create-vehicle"}
                                editEntityUrl={"/vehicles/edit-vehicle"}
                                deleteHandler={vehiclesStore.removeVehicle.bind(vehiclesStore)}

                ></CustomDataGrid>
            </Box>
        </Box>
    )
        ;
}

export default observer(Vehicles);