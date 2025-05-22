import {Box, Button, Grid, MenuItem, Stack, TextField, Typography, useTheme} from "@mui/material";
import {observer} from "mobx-react-lite";
import {tokens} from "../../theme.js";
import Header from "../../components/Header.jsx";
import * as React from "react";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import mileageLogsStore from "../../stores/mileageLogsStore.js";
import useError from "../../utils/useError.js";
import vehiclesStore from "../../stores/vehiclesStore.js";
import TopBar from "../global/TopBar.jsx";

const MileageLogForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {mileageLogId} = useParams();
    const navigate = useNavigate();
    let [mileageLog, setMileageLog] = React.useState(
        {date: new Date().toISOString(), mileage: '', vehicleId: '', mileageDifference: ''});
    const [error, setError] = React.useState(null);

    const handleChange = (e) => {
        if (e.target.name === "vehicleId") {
            const vehicle = vehiclesStore.findVehicleById(e.target.value);
            const tempMileageSinceManufactured = vehicle.mileageSinceManufactured;
            setMileageLog({...mileageLog, mileage: tempMileageSinceManufactured, [e.target.name]: e.target.value});
        } else {
            setMileageLog({...mileageLog, [e.target.name]: e.target.value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setError("");
        }
        const vehicle = vehiclesStore.findVehicleById(mileageLog.vehicleId);
        mileageLog.mileageDifference = mileageLog.mileage - vehicle.mileageSinceManufactured;
        await mileageLogsStore.addMileageLog(mileageLog);
        navigate('/mileage-logs');
    };

    const validateForm = () => {
        return !mileageLog.mileage
            || !mileageLog.vehicleId;
    };

    useEffect(() => {
        if (mileageLogId) {
            const founderMileageLog = mileageLogsStore.mileageLogs
                .find(mileageLog => mileageLog.id === parseInt(mileageLogId));
            setMileageLog(founderMileageLog);
        }
    }, []);

    useError();

    return (
        <Box m={"20px"}>
            <TopBar headerBox={
                <>
                    {mileageLogId ? (
                            <Header title={`ПІДРОЗДІЛ №${mileageLogId}`} subtitle={"Редагування підрозділу"}/>) :
                        (<Header title={`НОВИЙ ПІДРОЗДІЛ`} subtitle={"Створення підрозділу"}/>)
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
                        <Grid item size={6}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Пробіг"
                                name="mileage"
                                fullWidth
                                value={mileageLog.mileage || ''}
                            />
                        </Grid>
                        <Grid item size={6}>
                            <TextField
                                onChange={handleChange}
                                sx={{marginTop: '5px'}}
                                label="Транспортний засіб"
                                name="vehicleId"
                                select
                                fullWidth
                                value={mileageLog.vehicleId || ''}
                            >
                                {vehiclesStore.vehicles.map((vehicles) => (
                                    <MenuItem key={vehicles.id} value={vehicles.id}>
                                        {vehicles.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                    {error && <Typography color="error">{error}</Typography>}
                    <Box display={"flex"} justifyContent={'end'} sx={{mt: 2}}>
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

export default observer(MileageLogForm);