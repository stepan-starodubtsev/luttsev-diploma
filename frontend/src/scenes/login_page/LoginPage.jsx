// frontend/src/src/scenes/LoginPage/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import authStore from '../../stores/authStore'; //

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
    Typography,
    useTheme // Використовуємо нашу кастомну тему
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// ThemeProvider тут більше не потрібен, якщо App.jsx вже його надає
// import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ROLES } from "../../utils/constants.js"; //

// const defaultTheme = createTheme(); // Видаляємо, будемо використовувати тему з App.jsx

const LoginPage = observer(() => {
    const theme = useTheme(); // Отримуємо нашу кастомну тему
    const [email, setEmail] = useState(''); // Змінено username на email
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            authStore.setError("Email та пароль не можуть бути порожніми."); // Використовуємо setError
            return;
        }
        await authStore.login(email, password); // Викликаємо login з email

        if (authStore.isAuthenticated && authStore.user) { // Перевіряємо після логіну
            let destinationLocation;
            // Використовуємо нові ролі з constants.js
            if (authStore.user.role === ROLES.ADMIN) {
                destinationLocation = '/'; // Або spezifischer Admin-Dashboard
            } else if (authStore.user.role === ROLES.DEPARTMENT_EMPLOYEE) {
                destinationLocation = '/'; // Наприклад, дашборд або список занять
            } else if (authStore.user.role === ROLES.COMMANDER) {
                destinationLocation = '/training-sessions'; // Або календар, або його підрозділ
            } else if (authStore.user.role === ROLES.INSTRUCTOR) {
                destinationLocation = '/training-sessions'; // Або календар
            }
            else {
                destinationLocation = '/profile'; // За замовчуванням на профіль, якщо роль не визначена
            }
            navigate(destinationLocation, { replace: true });
        }
    };

    return (
        // ThemeProvider тут не потрібен, якщо він є в App.jsx
        <Container component="main"
                   maxWidth={false} // Дозволяємо контейнеру займати всю ширину
                   sx={{
                       height: '100vh',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       // Приклад фону:
                       // backgroundImage: 'url(/path-to-your-background-image.jpg)',
                       // backgroundSize: 'cover',
                       // backgroundPosition: 'center',
                       // Або градієнт:
                       background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                   }}
        >
            <CssBaseline />
            <Paper
                elevation={8} // Більша тінь для виділення
                sx={{
                    padding: { xs: 2, sm: 3, md: 4 }, // Адаптивні відступи
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: '12px', // Більш заокруглені кути
                    maxWidth: '400px', // Обмеження ширини форми
                    width: '100%',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    Вхід в Систему
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Адреса електронної пошти" // Змінено з "Ім'я користувача"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (authStore.error) authStore.setError(null); // Використовуємо setError
                        }}
                        error={!!authStore.error && (authStore.error.toLowerCase().includes("email") || authStore.error.toLowerCase().includes("користувача"))}
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
                            if (authStore.error) authStore.setError(null); // Використовуємо setError
                        }}
                        error={!!authStore.error && authStore.error.toLowerCase().includes("пароль")}
                    />
                    {authStore.error && (
                        <Alert severity="error" sx={{ width: '100%', mt: 2, mb: 1 }}>
                            {authStore.error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary" // Використовуємо primary колір з теми
                        sx={{
                            mt: 3,
                            mb: 2,
                            padding: '10px 0', // Збільшуємо висоту кнопки
                            fontSize: '1rem'   // Збільшуємо шрифт на кнопці
                        }}
                        disabled={authStore.loading}
                    >
                        {authStore.loading ? <CircularProgress size={24} color="inherit" /> : 'Увійти'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
});

export default LoginPage;