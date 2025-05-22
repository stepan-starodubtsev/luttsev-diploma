import {Box, Button, Grid, MenuItem, Stack, TextField, Typography, useTheme} from "@mui/material";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {observer} from "mobx-react-lite";
import {tokens} from "../../theme.js";
import Header from "../../components/Header.jsx";
import * as React from "react";
import {useEffect} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import useError from "../../utils/useError.js";
import {ConditionCategories, VehicleComponentTypes} from "../../utils/constants.js";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import vehiclesStore from "../../stores/vehiclesStore.js";
import getUrlParentPath from "../../utils/getUrlParentPath.js";
import TopBar from "../global/TopBar.jsx";

const VehicleForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {vehicleComponentId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [vehicleComponent, setVehicleComponent] = React.useState({
        id: '',
        name: '',
        componentType: '',
        manufacturerNumber: '',
        manufacturedAt: '',
        mileageSinceManufactured: '',
        mileageAfterLastRepair: '',
        annualResourceNorm: '',
        maxResource: '',
        conditionCategory: ''
    });
    const [error, setError] = React.useState(null);

    const handleChange = (e) => {
        setVehicleComponent({...vehicleComponent, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setError("");
        }
        console.log(vehicleComponent);
        if (vehicleComponentId) {
            vehiclesStore.tempVehicle.components[
                vehiclesStore.indexOfComponentById(vehicleComponentId)] = vehicleComponent;
            setVehicleConditionCategory();
            navigate(getUrlParentPath(3, location.pathname));
        } else {
            vehicleComponent.id = vehiclesStore.tempVehicle.components.length > 0 ?
                vehiclesStore.tempVehicle.components[vehiclesStore.tempVehicle.components.length - 1].id + 1 : 1;
            vehiclesStore.tempVehicle.components.push(vehicleComponent);
            setVehicleConditionCategory();
            navigate(getUrlParentPath(2, location.pathname));
        }
    };

    const setVehicleConditionCategory = () => {
        if (vehiclesStore.tempVehicle.components.length !== 1) {
            const currentVehicleCategory = +vehiclesStore.tempVehicle.conditionCategory || 0;
            const componentVehicleCategory = +vehicleComponent.conditionCategory;

            if (componentVehicleCategory > currentVehicleCategory) {
                vehiclesStore.tempVehicle.conditionCategory = vehicleComponent.conditionCategory;
            }
        } else {
            vehiclesStore.tempVehicle.conditionCategory = vehicleComponent.conditionCategory;
        }
    }
    const validateForm = () => {
        return !vehicleComponent.name ||
            !vehicleComponent.componentType ||
            !vehicleComponent.manufacturerNumber ||
            !vehicleComponent.manufacturedAt ||
            !vehicleComponent.mileageSinceManufactured ||
            !vehicleComponent.annualResourceNorm ||
            !vehicleComponent.maxResource ||
            !vehicleComponent.conditionCategory
    };

    useEffect(() => {
        if (vehicleComponentId) {
            setVehicleComponent(vehiclesStore.findComponentById(vehicleComponentId));
        }
    }, []);

    useError();

    return (
        <Box m={"20px"}>
            <TopBar headerBox={(
                <>
                    {vehicleComponentId ? (<Header title={`АГРЕГАТ №${vehicleComponentId}`}
                                                   subtitle={"Редагування агрегату"}/>) :
                        (<Header title={`НОВИЙ АГРЕГАТ`} subtitle={"Створення агрегату"}/>)
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
                        <Grid item size={4}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Назва агрегату"
                                autoComplete="name"
                                name="name"
                                value={vehicleComponent?.name || ''}
                                fullWidth
                            />
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Тип агрегату"
                                name="componentType"
                                select
                                fullWidth
                                value={vehicleComponent?.componentType || ''}
                            >
                                {VehicleComponentTypes.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Індивідуальний номер виробника"
                                autoComplete="manufacturerNumber"
                                name="manufacturerNumber"
                                value={vehicleComponent?.manufacturerNumber || ''}
                                fullWidth
                            />
                        </Grid>
                        <Grid item size={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
                                <DatePicker
                                    label="Дата випуску"
                                    value={vehicleComponent?.manufacturedAt ?
                                        dayjs(vehicleComponent.manufacturedAt) : null}
                                    onChange={(newValue) => {
                                        setVehicleComponent(prev => ({
                                            ...prev,
                                            manufacturedAt: newValue ?
                                                newValue.toISOString() : null,
                                        }));
                                    }}
                                    format="DD-MM-YYYY"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            sx: {
                                                marginTop: '5px',
                                                '& .MuiPickersInputBase-root': {
                                                    '& .Mui-focused': {
                                                        borderColor: colors.grey[200],
                                                        color: colors.grey[200],
                                                    },
                                                    '&:hover .MuiPickersOutlinedInput-notchedOutline': {
                                                        borderColor: colors.grey[200],
                                                    },
                                                },
                                            },
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Пробіг з випуску"
                                autoComplete="mileageSinceManufactured"
                                name="mileageSinceManufactured"
                                value={vehicleComponent?.mileageSinceManufactured || ''}
                                fullWidth
                            />
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Пробіг з минулого ремонту"
                                autoComplete="mileageAfterLastRepair"
                                name="mileageAfterLastRepair"
                                value={vehicleComponent?.mileageAfterLastRepair || ''}
                                fullWidth
                            />
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Річна норма роботи, км"
                                autoComplete="annualResourceNorm"
                                name="annualResourceNorm"
                                value={vehicleComponent?.annualResourceNorm || ''}
                                fullWidth
                            />
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Максимальний ресурс роботи, км"
                                autoComplete="maxResource"
                                name="maxResource"
                                value={vehicleComponent?.maxResource || ''}
                                fullWidth
                            />
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Категорія ТЗ"
                                name="conditionCategory"
                                select
                                fullWidth
                                value={vehicleComponent?.conditionCategory || ''}
                            >
                                {ConditionCategories.map((category) => (
                                    <MenuItem key={category.value} value={category.value}>
                                        {category.label}
                                    </MenuItem>
                                ))}
                            </TextField>
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