import {Box, Button, Grid, MenuItem, Stack, TextareaAutosize, TextField, Typography, useTheme} from "@mui/material";
import {observer} from "mobx-react-lite";
import {tokens} from "../../theme.js";
import Header from "../../components/Header.jsx";
import * as React from "react";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import maintenancesStore from "../../stores/maintenancesStore.js";
import useError from "../../utils/useError.js";
import vehiclesStore from "../../stores/vehiclesStore.js";
import {MaintenanceTypes} from "../../utils/constants.js";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import TopBar from "../global/TopBar.jsx";

const MaintenanceForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {maintenanceId} = useParams();
    const navigate = useNavigate();
    let [maintenance, setMaintenance] = React.useState(
        {type: '', date: '', result: '', vehicleId: ''});
    const [error, setError] = React.useState(null);

    const handleChange = (e) => {
        setMaintenance({...maintenance, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setError("");
        }
        if (maintenanceId) {
            await maintenancesStore.updateMaintenance(parseInt(maintenanceId), maintenance);
        } else {
            await maintenancesStore.addMaintenance(maintenance);
        }
        navigate('/maintenances');
    };

    const validateForm = () => {
        return !maintenance.type
            || !maintenance.date
            || !maintenance.vehicleId;
    };

    useEffect(() => {
        if (maintenanceId) {
            const founderMaintenance = maintenancesStore.maintenances
                .find(maintenance => maintenance.id === parseInt(maintenanceId));
            setMaintenance(founderMaintenance);
        }
    }, []);

    useError();

    return (
        <Box m={"20px"}>
            <TopBar headerBox={<>
                {
                    maintenanceId ? (<Header title={`ТЕХНІЧНЕ ОБСЛУГОВУВАННЯ №${maintenanceId}`}
                                             subtitle={"Редагування ТО"}/>) :
                        (<Header title={`НОВЕ ТЕХНІЧНЕ ОБСЛУГОВУВАННЯ`} subtitle={"Створення ТО"}/>)
                }
            </>}/>
            <Box>
                <Stack component="form" onSubmit={handleSubmit}
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
                                label="Тип ТО"
                                name="type"
                                select
                                fullWidth
                                value={maintenance.type || ''}
                            >
                                {MaintenanceTypes.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item size={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
                                <DatePicker
                                    label="Дата проведення"
                                    value={maintenance.date ? dayjs(maintenance.date) : null}
                                    onChange={(newDate) => {
                                        setMaintenance({
                                            ...maintenance,
                                            date: newDate ? newDate.toISOString() : null,
                                        });
                                    }}
                                    name="date"
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
                                label="Транспортний засіб"
                                name="vehicleId"
                                select
                                fullWidth
                                value={maintenance.vehicleId || ''}
                            >
                                {vehiclesStore.vehicles.map((vehicles) => (
                                    <MenuItem key={vehicles.id} value={vehicles.id}>
                                        {vehicles.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item size={12}>
                            <TextareaAutosize
                                onChange={handleChange}
                                maxRows={4}
                                placeholder="Опис проведених робіт"
                                value={maintenance.result || ''}
                                name="result"
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

export default observer(MaintenanceForm);