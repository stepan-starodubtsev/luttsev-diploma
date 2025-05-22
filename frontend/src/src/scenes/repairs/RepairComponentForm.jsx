import {Box, Button, Grid, MenuItem, Stack, TextareaAutosize, TextField, Typography, useTheme} from "@mui/material";
import {observer} from "mobx-react-lite";
import {tokens} from "../../theme.js";
import Header from "../../components/Header.jsx";
import * as React from "react";
import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import useError from "../../utils/useError.js";
import vehiclesStore from "../../stores/vehiclesStore.js";
import getUrlParentPath from "../../utils/getUrlParentPath.js";
import repairsStore from "../../stores/repairsStore.js";
import TopBar from "../global/TopBar.jsx";

const VehicleForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {repairComponentId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [vehicle, setVehicle] = useState();
    const [repairComponent, setRepairComponent] = React.useState({
        id: '',
        vehicleComponentId: '',
        workDescription: ''
    });
    const [error, setError] = React.useState(null);

    const handleChange = (e) => {
        setRepairComponent({...repairComponent, [e.target.name]: e.target.value});
    };

    const handleChangeVehicle = (e) => {
        setVehicle(vehiclesStore.findVehicleById(e.target.value));
        console.log(vehicle);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setError("");
        }
        if (repairComponentId) {
            repairsStore.tempRepair.componentRepairs[
                repairsStore.indexOfComponentRepairById(repairComponentId)] = repairComponent;
            navigate(getUrlParentPath(3, location.pathname));
        } else {
            repairComponent.id = repairsStore.tempRepair.componentRepairs.length > 0 ?
                repairsStore.tempRepair.componentRepairs[repairsStore.tempRepair.componentRepairs.length - 1].id + 1 : 1;
            repairsStore.tempRepair.componentRepairs.push(repairComponent);
            navigate(getUrlParentPath(2, location.pathname));
        }
        repairsStore.tempRepair.vehicleId = vehicle?.id;
    };

    const validateForm = () => {
        return !repairComponent.vehicleComponentId
    };

    useEffect(() => {
        if (repairComponentId) {
            setRepairComponent(repairsStore.findComponentRepairById(repairComponentId));
        }
        if (repairsStore.tempRepair.vehicleId !== '') {
            setVehicle(vehiclesStore.findVehicleById(repairsStore.tempRepair.vehicleId));
        }
    }, []);

    useError();

    return (
        <Box m={"20px"}>
            <TopBar headerBox={(<>
                    {
                        repairComponentId ? (<Header title={`РЕМОНТ АГРЕГАТА №${repairComponentId}`}
                                                     subtitle={"Редагування ремонту агрегату"}/>) :
                            (<Header title={`НОВИЙ РЕМОНТ АГРЕГАТА`} subtitle={"Створення ремонту агрегату"}/>)
                    }
                </>
            )}/>
            <Box>
                <Stack spacing={2} component="form" onSubmit={handleSubmit}
                       sx={{
                           '& label.Mui-focused': {
                               color: colors.grey[200],
                           },
                           '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                               borderColor: colors.grey[200],
                           },
                       }}>
                    <Grid container spacing={2}>
                        <Grid item size={6}>
                            <TextField
                                onChange={handleChangeVehicle}
                                sx={{marginTop: '5px'}}
                                label="Транспортний засіб"
                                name="vehicleId"
                                select
                                fullWidth
                                value={vehicle?.id || ''}
                            >
                                {vehiclesStore.vehicles.map((vehicles) => (
                                    <MenuItem key={vehicles.id} value={vehicles.id}>
                                        {vehicles.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item size={6}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Агрегат транспортного засобу"
                                name="vehicleComponentId"
                                select
                                fullWidth
                                value={repairComponent?.vehicleComponentId || ''}
                            >
                                {vehicle?.components.map((vehicleComponent) => (
                                    <MenuItem key={vehicleComponent.id} value={vehicleComponent.id}>
                                        {vehicleComponent.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item size={12}>
                            <TextareaAutosize
                                onChange={handleChange}
                                maxRows={4}
                                placeholder="Опис проведеної роботи ремонту"
                                value={repairComponent?.workDescription || ''}
                                name="workDescription"
                                style={{
                                    backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500]
                                        : theme.palette.grey[100],
                                    borderColor: colors.grey[600],
                                    color: theme.palette.mode === 'dark' ? theme.palette.grey[100]
                                        : colors.primary[500],
                                    fontSize: 16,
                                    width: "100%",
                                    height: "100px",
                                    marginTop: '5px'
                                }}
                            />
                        </Grid>
                    </Grid>
                    {error && <Typography color="error">{error}</Typography>}
                    <Box display={"flex"} justifyContent={'end'}>
                        <Button type="submit" color={colors.primary[400]} variant="outlined"
                                disabled={validateForm()}>
                            Зберегти
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}

export default observer(VehicleForm);