import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {observer} from "mobx-react-lite";
import {tokens} from "../../theme.js";
import Header from "../../components/Header.jsx";
import * as React from "react";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import useError from "../../utils/useError.js";
import {
    ConditionCategories,
    FuelTypes,
    OilTypes,
    OperationGroups,
    VehicleComponentTypes,
    VehicleTypes
} from "../../utils/constants.js";
import unitsStore from "../../stores/unitsStore.js";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid.jsx";
import vehiclesStore from "../../stores/vehiclesStore.js";
import TopBar from "../global/TopBar.jsx";

const VehicleForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {vehicleId} = useParams();
    const navigate = useNavigate();

    const vehicleComponentsColumns = [
        {field: 'id', headerName: 'ID'},
        {field: 'name', headerName: 'Назва', cellClassName: "name-column--cell"},
        {
            field: 'componentType', headerName: 'Тип',
            type: 'singleSelect', valueOptions: VehicleComponentTypes
        },
        {field: 'manufacturerNumber', headerName: 'Заводський номер'},
        {
            field: 'conditionCategory', headerName: 'Категорія стану аграгата',
            type: 'singleSelect', valueOptions: ConditionCategories
        },
        {field: 'manufacturedAt', headerName: 'Дата виготовлення'},
        {field: 'mileageSinceManufactured', headerName: 'Пробіг з виготовлення'},
        {field: 'mileageAfterLastRepair', headerName: 'Пробіг з останнього ремонту'},
        {field: 'annualResourceNorm', headerName: 'Річна норма ресурсу'},
        {field: 'annualResourceActual', headerName: 'Використано ресурсу в цьому році'},
        {field: 'remainingAnnualResource', headerName: 'Залишилося ресурсу в цьому році'},
        {field: 'remainingResourceToNextRepair', headerName: 'Залишилося ресурсу до наступного капітального ремонту'},
        {field: 'maxResource', headerName: 'Максимальний можливий ресурс'},
        {field: 'needsMaintenance', headerName: 'Потребує ТО', type: 'boolean'},
        {field: 'needsCapitalRepair', headerName: 'Потребує капітального ремонту', type: 'boolean'},
        {
            field: 'vehicleId', headerName: 'Транспортний засіб', renderCell: () => {
                return vehiclesStore.tempVehicle.id;
            }
        },
    ];

    const [error, setError] = React.useState(null);

    const handleChange = (e) => {
        vehiclesStore.setTempVehicle(({...vehiclesStore.tempVehicle, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setError("");
        }
        if (vehicleId) {
            await vehiclesStore.updateVehicle(parseInt(vehicleId));
        } else {
            await vehiclesStore.addVehicle();
        }
        vehiclesStore.clearTempVehicle();
        navigate('/vehicles');
    };

    const validateForm = () => {
        return !vehiclesStore.tempVehicle.name ||
            !vehiclesStore.tempVehicle.type ||
            !vehiclesStore.tempVehicle.licensePlate ||
            !vehiclesStore.tempVehicle.manufacturerNumber ||
            !vehiclesStore.tempVehicle.manufacturedAt ||
            !vehiclesStore.tempVehicle.operationGroup ||
            !vehiclesStore.tempVehicle.mileageSinceManufactured ||
            !vehiclesStore.tempVehicle.annualResourceNorm ||
            !vehiclesStore.tempVehicle.conditionCategory ||
            !vehiclesStore.tempVehicle.fuelType ||
            !vehiclesStore.tempVehicle.oilType ||
            vehiclesStore.tempVehicle.components.length === 0 ||
            !vehiclesStore.tempVehicle.unitId;
    };

    useEffect(() => {
        if (vehicleId) {
            vehiclesStore.setTempVehicle(vehiclesStore.vehicles.find(vehicle => vehicle.id === parseInt(vehicleId)));
        } else {
            if (vehiclesStore.tempVehicle.name === "" && vehiclesStore.tempVehicle.components.length === 0) {
                vehiclesStore.clearTempVehicle();
            }
        }
    }, []);

    useError();

    return (
        <Box sx={{maxWidth: "81vw", m: "20px"}}>
            <TopBar headerBox={(
                <>
                    {vehicleId ? (<Header title={`ТРАНСПОРТНИЙ ЗАСІБ №${vehicleId}`}
                                          subtitle={"Редагування транспортного засобу"}/>) :
                        (<Header title={`НОВИЙ ТРАНСПОРТНИЙ ЗАСІБ`} subtitle={"Створення транспортного засобу"}/>)
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
                                label="Назва ТЗ"
                                autoComplete="name"
                                name="name"
                                value={vehiclesStore.tempVehicle?.name || ''}
                                fullWidth
                            />
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Тип ТЗ"
                                name="type"
                                select
                                fullWidth
                                value={vehiclesStore.tempVehicle?.type || ''}
                            >
                                {VehicleTypes.map((type) => (
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
                                label="Дорожній номер"
                                autoComplete="licensePlate"
                                name="licensePlate"
                                value={vehiclesStore.tempVehicle?.licensePlate || ''}
                                fullWidth
                            />
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Індивідуальний номер виробника"
                                autoComplete="manufacturerNumber"
                                name="manufacturerNumber"
                                value={vehiclesStore.tempVehicle?.manufacturerNumber || ''}
                                fullWidth
                            />
                        </Grid>
                        <Grid item size={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
                                <DatePicker
                                    label="Дата випуску"
                                    value={vehiclesStore.tempVehicle?.manufacturedAt ? dayjs(vehiclesStore.tempVehicle.manufacturedAt) : null}
                                    onChange={(newDate) => {
                                        vehiclesStore.tempVehicle = {
                                            ...vehiclesStore.tempVehicle,
                                            manufacturedAt: newDate ? newDate.toISOString() : null,
                                        };
                                    }}
                                    name="manufacturedAt"
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
                                label="Група експлуатації"
                                name="operationGroup"
                                select
                                fullWidth
                                value={vehiclesStore.tempVehicle?.operationGroup || ''}
                            >
                                {OperationGroups.map((group) => (
                                    <MenuItem key={group.value} value={group.value}>
                                        {group.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Пробіг з випуску"
                                autoComplete="mileageSinceManufactured"
                                name="mileageSinceManufactured"
                                value={vehiclesStore.tempVehicle?.mileageSinceManufactured || ''}
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
                                value={vehiclesStore.tempVehicle?.annualResourceNorm || ''}
                                fullWidth
                            />
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                disabled
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Категорія ТЗ"
                                name="conditionCategory"
                                select
                                fullWidth
                                value={vehiclesStore.tempVehicle?.conditionCategory || ''}
                            >
                                {ConditionCategories.map((category) => (
                                    <MenuItem key={category.value} value={category.value}>
                                        {category.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Тип пального"
                                name="fuelType"
                                select
                                fullWidth
                                value={vehiclesStore.tempVehicle?.fuelType || ''}
                            >
                                {FuelTypes.map((fuelType) => (
                                    <MenuItem key={fuelType.value} value={fuelType.value}>
                                        {fuelType.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Тип мастила"
                                name="oilType"
                                select
                                fullWidth
                                value={vehiclesStore.tempVehicle?.oilType || ''}
                            >
                                {OilTypes.map((oilType) => (
                                    <MenuItem key={oilType.value} value={oilType.value}>
                                        {oilType.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Підрозділ"
                                name="unitId"
                                select
                                fullWidth
                                value={vehiclesStore.tempVehicle?.unitId || ''}
                            >
                                {unitsStore.units.map((unit) => (
                                    <MenuItem key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item size={12}>
                            <Accordion
                                sx={{
                                    backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500]
                                        : theme.palette.grey[100],
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore/>}
                                >
                                    <Typography>
                                        Агрегати транспортного засобу
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                >
                                    <CustomDataGrid
                                        columns={vehicleComponentsColumns}
                                        rows={vehiclesStore.tempVehicle.components}
                                        addEntityUrl={"vehicle-components/create-component"}
                                        editEntityUrl={"vehicle-components/edit-component"}
                                        deleteHandler={vehiclesStore.removeVehicleComponent.bind(vehiclesStore)}
                                    />
                                </AccordionDetails>
                            </Accordion>
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