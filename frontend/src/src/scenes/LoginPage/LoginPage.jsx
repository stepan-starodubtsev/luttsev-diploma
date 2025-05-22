import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import authStore from '../../stores/authStore';

import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {ROLES} from "../../utils/constants.js";

const defaultTheme = createTheme();

const LoginPage = observer(() => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!username || !password) {
            authStore.error = "Ім'я користувача та пароль не можуть бути порожніми.";
            return;
        }
        await authStore.login(username, password);
        let destinationLocation;

        if (authStore.user.role === ROLES.ADMIN) {
            destinationLocation = '/users';
        } else if (authStore.user.role === ROLES.DUTY_STAFF) {
            destinationLocation = '/mileage-logs';
        } else {
            destinationLocation = '/';
        }
        navigate(destinationLocation, {replace: true});
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Paper elevation={6} sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 4,
                }}>
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Вхід в систему
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1, width: '100%'}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Ім'я користувача"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (authStore.error) authStore.error = null;
                            }}
                            error={!!authStore.error && authStore.error.toLowerCase().includes("користувача")}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (authStore.error) authStore.error = null;
                            }}
                            error={!!authStore.error && authStore.error.toLowerCase().includes("пароль")}
                        />
                        {authStore.error && (
                            <Alert severity="error" sx={{width: '100%', mt: 2, mb: 1}}>
                                {authStore.error}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            disabled={authStore.loading}
                        >
                            {authStore.loading ? <CircularProgress size={24} color="inherit"/> : 'Увійти'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
});

export default LoginPage;