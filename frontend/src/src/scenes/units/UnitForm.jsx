import {Box, Button, MenuItem, Stack, TextField, Typography, useTheme} from "@mui/material";
import {observer} from "mobx-react-lite";
import {tokens} from "../../theme.js";
import Header from "../../components/Header.jsx";
import * as React from "react";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import unitsStore from "../../stores/unitsStore.js";
import useError from "../../utils/useError.js";
import usersStore from "../../stores/usersStore.js";
import TopBar from "../global/TopBar.jsx";

const UnitForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {unitId} = useParams();
    const navigate = useNavigate();
    const [unit, setUnit] = React.useState({name: '', commanderId: ''});
    const [unitCommanders, setUnitCommanders] = React.useState([]);
    const [error, setError] = React.useState(null);

    const handleChange = (e) => {
        setUnit({...unit, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setError("");
        }
        if (unitId) {
            await unitsStore.updateUnit(parseInt(unitId), unit);
        } else {
            await unitsStore.addUnit(unit);
        }
        navigate('/units');
    };

    const validateForm = () => {
        return !unit.name || !unit.commanderId;
    };

    useEffect(() => {
        if (unitId) {
            const founderUnit = unitsStore.units.find(unit => unit.id === parseInt(unitId));
            setUnit(founderUnit);
        }
        const commanders = usersStore.users.filter((user) => user.role === 'UNIT_COMMANDER');
        setUnitCommanders(commanders);
    }, []);

    useError();

    return (
        <Box m={"20px"}>
            <TopBar headerBox={(
                <>
                    {unitId ? (<Header title={`ПІДРОЗДІЛ №${unitId}`} subtitle={"Редагування підрозділу"}/>) :
                        (<Header title={`НОВИЙ ПІДРОЗДІЛ`} subtitle={"Створення підрозділу"}/>)
                    }
                </>
            )}/>
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
                    <TextField
                        onChange={handleChange}
                        sx={{marginTop: '5px'}}
                        label="Назва підрозділу"
                        autoComplete="name"
                        name="name"
                        value={unit?.name || ''}
                    />
                    <TextField
                        onChange={handleChange}
                        sx={{mt: 2, mb: 2}}
                        label="Командир"
                        name="commanderId"
                        select
                        fullWidth
                        value={unit?.commanderId || ''}
                    >
                        {unitCommanders.map((commander) => (
                            <MenuItem key={commander.id} value={commander.id}>
                                {commander.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    {error && <Typography color="error">{error}</Typography>}
                    <div>
                        <Button type="submit" color={colors.primary[400]} variant="outlined"
                                disabled={validateForm()}>
                            Зберегти
                        </Button>
                    </div>
                </Stack>
            </Box>
        </Box>
    );
}

export default observer(UnitForm);