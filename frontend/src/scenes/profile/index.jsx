import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {observer} from "mobx-react-lite";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityOnIcon from '@mui/icons-material/Visibility';
import {tokens} from "../../theme.js";
import Header from "../../components/Header.jsx";
import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import usersStore from "../../stores/usersStore.js";
import useError from "../../utils/useError.js";
import TopBar from "../global/TopBar.jsx";
import {authStore} from "../../stores/authStore.js";

const ProfileForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {userId} = useParams();
    const navigate = useNavigate();
    const [user, setUser] = React.useState({name: '', username: '', role: '', password: ''});
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = React.useState(null);

    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setError("");
        }
        await usersStore.updateUser(authStore.user.id, user);
        navigate('/profile');
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const validateForm = () => {
        return !user.name || !user.username || !user.role;
    };

    useEffect(() => {
        console.log(authStore.user);
        setUser(authStore.user);
    }, []);

    useError();

    return (
        <Box m={"20px"}>
            <TopBar headerBox={(
                <>
                    <Header title={`ОСОБИСТИЙ КАБІНЕТ`} subtitle={"Редагування профілю користувача"}/>
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
                        label="ПІБ"
                        autoComplete="name"
                        name="name"
                        value={user?.name || ''}
                    />
                    <TextField
                        onChange={handleChange}
                        sx={{marginTop: '20px'}}
                        label="Логін"
                        autoComplete="username"
                        name="username"
                        value={user?.username || ''}
                    />
                    <FormControl sx={{margin: '20px 0'}} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            label="Пароль"
                            autoComplete="current-password"
                            onChange={handleChange}
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                                        onClick={togglePasswordVisibility}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOffIcon/> : <VisibilityOnIcon/>}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
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

export default observer(ProfileForm);