// frontend/src/src/scenes/training_sessions/TrainingSessionFormPage.jsx
import React, {useState, useEffect} from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
    Grid,
    Stack,
    MenuItem,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    CircularProgress
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";
import Header from "../../components/Header.jsx";
import TopBar from "../global/TopBar.jsx";
import {LocalizationProvider, DateTimePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

import trainingSessionStore from "../../stores/trainingSessionStore"; // Розкоментовано
import userStore from "../../stores/userStore.js"; // Розкоментовано
import unitStore from "../../stores/unitStore.js"; // Розкоментовано
import locationStore from "../../stores/locationStore"; // Розкоментовано
import exerciseStore from "../../stores/exerciseStore"; // Розкоментовано
import useError from "../../utils/useError.js"; // Розкоментовано
import {SessionTypes} from "../../utils/constants.js"; // Переконайтесь, що є

const TrainingSessionFormPage = () => {
    const theme = useTheme();
    const {sessionId} = useParams();
    const navigate = useNavigate();
    dayjs.locale('uk');

    const [session, setSession] = useState({
        session_type: '',
        start_datetime: dayjs(),
        end_datetime: dayjs().add(1, 'hour'),
        location_id: '',
        conducted_by_user_id: '',
        unit_id: '',
        exercises: [], // Масив об'єктів { exercise_id: '', order_in_session: 1 }
    });
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Локальний для завантаження форми
    const areRelatedStoresLoading = locationStore.loading || userStore.loading || unitStore.loading || exerciseStore.loading;


    useEffect(() => {
        const fetchData = async () => {
            // Завантажуємо довідники, якщо їх немає
            if (locationStore.locations.length === 0 && !locationStore.loading) await locationStore.loadLocations();
            if (userStore.users.length === 0 && !userStore.loading) await userStore.loadUsers(); // Можливо, фільтрувати за ролями
            if (unitStore.units.length === 0 && !unitStore.loading) await unitStore.loadUnits();
            if (exerciseStore.exercises.length === 0 && !exerciseStore.loading) await exerciseStore.loadExercises();

            if (sessionId) {
                setIsLoading(true);
                const data = await trainingSessionStore.loadSessionById(parseInt(sessionId));
                if (data) {
                    setSession({
                        ...data,
                        start_datetime: data.start_datetime ? dayjs(data.start_datetime) : dayjs(),
                        end_datetime: data.end_datetime ? dayjs(data.end_datetime) : dayjs().add(1, 'hour'),
                        // Бекенд має повертати exercises як масив об'єктів { exercise_id, order_in_session, ... }
                        // якщо це зв'язок many-to-many через SessionExercise, можливо потрібно буде трансформувати
                        exercises: data.exercises ? data.exercises.map(ex => ({
                            exercise_id: ex.exercise_id,
                            order_in_session: ex.SessionExercise?.order_in_session || ex.order_in_session || 0
                        })) : []
                    });
                } else {
                    setFormError("Не вдалося завантажити дані заняття.");
                }
                setIsLoading(false);
            } else {
                setSession({
                    session_type: '',
                    start_datetime: dayjs(),
                    end_datetime: dayjs().add(1, 'hour'),
                    location_id: '',
                    conducted_by_user_id: '',
                    unit_id: '',
                    exercises: []
                });
                trainingSessionStore.clearSelectedSession();
            }
            setFormError('');
        };
        fetchData();
        return () => {
            // trainingSessionStore.clearSelectedSession();
        }
    }, [sessionId]);

    useError(trainingSessionStore);
    useError(locationStore);
    useError(userStore);
    useError(unitStore);
    useError(exerciseStore);

    const handleChange = (e) => {
        setSession({...session, [e.target.name]: e.target.value});
    };

    const handleDateTimeChange = (name, newDateTime) => {
        setSession({...session, [name]: newDateTime});
    };

    const handleAddExercise = () => {
        setSession(prev => ({
            ...prev,
            exercises: [...prev.exercises, {exercise_id: '', order_in_session: prev.exercises.length + 1}]
        }));
    };

    const handleExerciseChange = (index, field, value) => {
        const newExercises = [...session.exercises];
        newExercises[index] = {...newExercises[index], [field]: value};
        newExercises.forEach((ex, i) => ex.order_in_session = i + 1); // Оновлюємо порядок
        setSession(prev => ({...prev, exercises: newExercises}));
    };

    const handleRemoveExercise = (index) => {
        const newExercises = session.exercises.filter((_, i) => i !== index);
        newExercises.forEach((ex, i) => ex.order_in_session = i + 1); // Оновлюємо порядок
        setSession(prev => ({...prev, exercises: newExercises}));
    };

    const validateForm = () => {
        if (!session.session_type || !session.start_datetime || !session.end_datetime || !session.location_id || !session.conducted_by_user_id) {
            setFormError("Тип, час початку/кінця, локація та відповідальний є обов'язковими.");
            return false;
        }
        if (dayjs(session.end_datetime).isBefore(dayjs(session.start_datetime))) {
            setFormError("Час закінчення не може бути раніше часу початку.");
            return false;
        }
        if (session.exercises.some(ex => !ex.exercise_id)) {
            setFormError("Для кожної доданої вправи необхідно обрати саму вправу.");
            return false;
        }
        setFormError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        setFormError('');
        const dataToSubmit = {
            ...session,
            start_datetime: session.start_datetime ? session.start_datetime.toISOString() : null,
            end_datetime: session.end_datetime ? session.end_datetime.toISOString() : null,
            exercises: session.exercises.map(ex => ({
                exercise_id: parseInt(ex.exercise_id), // Переконуємось, що ID є числом
                order_in_session: ex.order_in_session
            })),
            // Переконуємось, що ID є числами або null
            location_id: session.location_id ? parseInt(session.location_id) : null,
            conducted_by_user_id: session.conducted_by_user_id ? parseInt(session.conducted_by_user_id) : null,
            unit_id: session.unit_id ? parseInt(session.unit_id) : null,
        };
        if (dataToSubmit.unit_id === null || dataToSubmit.unit_id === '') delete dataToSubmit.unit_id;


        try {
            if (sessionId) {
                await trainingSessionStore.updateSession(parseInt(sessionId), dataToSubmit);
            } else {
                await trainingSessionStore.addSession(dataToSubmit);
            }
            navigate('/training-sessions');
        } catch (error) {
            setFormError(trainingSessionStore.error || "Помилка збереження заняття");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && sessionId && !trainingSessionStore.selectedSession) { // Показуємо завантаження тільки при редагуванні
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <CircularProgress/>
                <Typography sx={{ml: 2}}>Завантаження даних заняття...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{m: "20px"}}>
            <TopBar headerBox={
                <Header
                    title={sessionId ? `Редагувати Заняття №${session.session_id || sessionId}` : "Створити Нове Заняття"}
                    subtitle={sessionId ? "Оновлення даних про тренувальне заняття" : "Планування нового заняття"}
                />
            }/>
            <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
                    <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{mt: 2}}>
                        <Grid container spacing={2}>
                            {/* ... (поля session_type, location_id, conducted_by_user_id, unit_id, start_datetime, end_datetime як у попередньому прикладі, але з використанням даних зі сторів) ... */}
                            <Grid item size={4}>
                                <TextField label="Тип заняття" name="session_type" value={session.session_type || ''}
                                           onChange={handleChange} fullWidth select required
                                           disabled={isLoading || areRelatedStoresLoading}>
                                    <MenuItem value=""><em>Оберіть тип</em></MenuItem>
                                    {SessionTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item size={4}>
                                <TextField label="Локація" name="location_id" value={session.location_id || ''}
                                           onChange={handleChange} fullWidth select required
                                           disabled={isLoading || areRelatedStoresLoading}>
                                    <MenuItem value=""><em>Оберіть локацію</em></MenuItem>
                                    {locationStore.locations.map((loc) => (
                                        <MenuItem key={loc.location_id} value={loc.location_id}>{loc.name}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item size={4}>
                                <TextField label="Проводить" name="conducted_by_user_id"
                                           value={session.conducted_by_user_id || ''} onChange={handleChange} fullWidth
                                           select required disabled={isLoading || areRelatedStoresLoading}>
                                    <MenuItem value=""><em>Оберіть відповідального</em></MenuItem>
                                    {userStore.users.filter(u => u.role === 'INSTRUCTOR' || u.role === 'COMMANDER').map((user) => (
                                        <MenuItem key={user.user_id}
                                                  value={user.user_id}>{`${user.last_name} ${user.first_name}`}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item size={4}>
                                <TextField label="Підрозділ (опціонально)" name="unit_id" value={session.unit_id || ''}
                                           onChange={handleChange} fullWidth select
                                           disabled={isLoading || areRelatedStoresLoading}>
                                    <MenuItem value=""><em>Не обрано</em></MenuItem>
                                    {unitStore.units.map((unit) => (
                                        <MenuItem key={unit.unit_id} value={unit.unit_id}>{unit.unit_name}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item size={4}>
                                <DateTimePicker label="Час початку" value={session.start_datetime}
                                                onChange={(newVal) => handleDateTimeChange('start_datetime', newVal)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        required: true,
                                                        disabled: isLoading
                                                    }
                                                }} format="DD.MM.YYYY HH:mm"/>
                            </Grid>
                            <Grid item size={4}>
                                <DateTimePicker label="Час закінчення" value={session.end_datetime}
                                                onChange={(newVal) => handleDateTimeChange('end_datetime', newVal)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        required: true,
                                                        disabled: isLoading
                                                    }
                                                }} format="DD.MM.YYYY HH:mm"/>
                            </Grid>
                        </Grid>

                        <Typography variant="h5" sx={{mt: 3, mb: 1}}>Вправи на занятті</Typography>
                        <Paper variant="outlined" sx={{p: 2}}>
                            {session.exercises.map((sessionEx, index) => (
                                <Grid container spacing={1} key={index} alignItems="center" sx={{mb: 1}}>
                                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                                        <Typography>{index + 1}.</Typography>
                                    </Grid>
                                    <Grid item size={4}>
                                        <TextField
                                            label="Вправа"
                                            name="exercise_id"
                                            value={sessionEx.exercise_id || ''}
                                            onChange={(e) => handleExerciseChange(index, 'exercise_id', e.target.value)}
                                            fullWidth
                                            select
                                            size="small"
                                            disabled={isLoading || areRelatedStoresLoading}
                                        >
                                            <MenuItem value=""><em>Обрати вправу</em></MenuItem>
                                            {exerciseStore.exercises.map((ex) => (
                                                <MenuItem key={ex.exercise_id} value={ex.exercise_id}>
                                                    {ex.exercise_name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={1} sm={1} sx={{textAlign: 'right'}}>
                                        <IconButton onClick={() => handleRemoveExercise(index)} color="error"
                                                    disabled={isLoading}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button
                                startIcon={<AddCircleOutlineIcon/>}
                                onClick={handleAddExercise}
                                variant="outlined"
                                size="small"
                                sx={{mt: 1}}
                                disabled={isLoading || areRelatedStoresLoading}
                            >
                                Додати Вправу
                            </Button>
                        </Paper>

                        {formError && <Typography color="error" sx={{mt: 2}}>{formError}</Typography>}
                        {trainingSessionStore.error &&
                            <Typography color="error" sx={{mt: 1}}>{trainingSessionStore.error}</Typography>}
                        <Box display="flex" justifyContent="flex-end" mt={3}>
                            <Button type="submit" variant="contained" color="secondary"
                                    disabled={isLoading || trainingSessionStore.loading || areRelatedStoresLoading}>
                                {isLoading || trainingSessionStore.loading ?
                                    <CircularProgress size={24}/> : (sessionId ? "Зберегти Зміни" : "Створити Заняття")}
                            </Button>
                        </Box>
                    </Stack>
                </LocalizationProvider>
            </Box>
        </Box>
    );
};

export default observer(TrainingSessionFormPage);