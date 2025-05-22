import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Grid,
    MenuItem,
    Stack,
    TextareaAutosize,
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
import {RepairTypes} from "../../utils/constants.js";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid.jsx";
import repairsStore from "../../stores/repairsStore.js";
import vehiclesStore from "../../stores/vehiclesStore.js";
import TopBar from "../global/TopBar.jsx";

const RepairForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {repairId} = useParams();
    const navigate = useNavigate();

    const repairComponentsColumns = [
        {field: 'id', headerName: 'ID'},
        {
            field: 'vehicleComponentId', headerName: 'Ідентифікатор виробника деталі', renderCell: (params) => {
                const vehicle = vehiclesStore.vehicles.find(vehicles => vehicles.id === repairsStore.tempRepair.vehicleId);
                const component = vehicle.components.find(component => component.id === params.value);
                return component.manufacturerNumber;
            },
        },
    ];

    const [error, setError] = React.useState(null);

    const handleChange = (e) => {
        repairsStore.setTempRepair(({...repairsStore.tempRepair, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setError("");
        }
        if (repairId) {
            await repairsStore.updateRepair(parseInt(repairId));
        } else {
            await repairsStore.addRepair();
        }
        repairsStore.clearTempRepair();
        navigate('/repairs');
    };

    const validateForm = () => {
        return !repairsStore.tempRepair.type ||
            !repairsStore.tempRepair.date ||
            !repairsStore.tempRepair.repairReasonText ||
            repairsStore.tempRepair.componentRepairs.length === 0 ||
            !repairsStore.tempRepair.vehicleId;
    };

    useEffect(() => {
        if (repairId) {
            repairsStore.setTempRepair(repairsStore.repairs.find(repair => repair.id === parseInt(repairId)));
        } else {
            if (repairsStore.tempRepair.name === "" && repairsStore.tempRepair.components.length === 0) {
                repairsStore.clearTempRepair();
            }
        }
    }, []);

    useError();

    return (
        <Box sx={{maxWidth: "81vw", m: "20px"}}>
            <TopBar headerBox={(
                <>
                    {repairId ? (<Header title={`РЕМОНТ №${repairId}`}
                                         subtitle={"Редагування ремонту"}/>) :
                        (<Header title={`НОВИЙ РЕМОНТ`} subtitle={"Створення ремонту"}/>)
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
                                label="Тип ремонту"
                                name="type"
                                select
                                fullWidth
                                value={repairsStore.tempRepair?.type || ''}
                            >
                                {RepairTypes.map((type) => (
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
                                    value={repairsStore.tempRepair?.date ? dayjs(repairsStore.tempRepair.date) : null}
                                    onChange={(newDate) => {
                                        repairsStore.tempRepair = {
                                            ...repairsStore.tempRepair,
                                            date: newDate ? newDate.toISOString() : null,
                                        };
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
                                value={repairsStore.tempRepair?.vehicleId || ''}
                            >
                                {vehiclesStore.vehicles.map((vehicles) => (
                                    <MenuItem key={vehicles.id} value={vehicles.id}>
                                        {vehicles.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item size={6}>
                            <TextareaAutosize
                                onChange={handleChange}
                                maxRows={4}
                                placeholder="Причина ремонту"
                                value={repairsStore.tempRepair?.repairReasonText || ''}
                                name="repairReasonText"
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
                        <Grid item size={6}>
                            <TextareaAutosize
                                onChange={handleChange}
                                maxRows={4}
                                placeholder="Опис проведеної роботи ремонту"
                                value={repairsStore.tempRepair?.workDescription || ''}
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
                        <Grid item size={12}>
                            <Accordion
                                sx={{
                                    backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500]
                                        : theme.palette.grey[100],
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMore/>}>
                                    <Typography color={colors.grey[200]} variant={"h5"}>
                                        Агрегати, що підлягають ремонту
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <CustomDataGrid columns={repairComponentsColumns}
                                                    rows={repairsStore.tempRepair.componentRepairs}
                                                    addEntityUrl={"repair-components/create-repair"}
                                                    editEntityUrl={"repair-components/edit-repair"}
                                                    deleteHandler={repairsStore.removeRepairComponent
                                                        .bind(repairsStore)}
                                    ></CustomDataGrid>
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

export default observer(RepairForm);