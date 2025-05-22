import {ColorModeContext, useMode} from "./theme.js";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {Navigate, Route, Routes} from "react-router-dom";
import {observer} from 'mobx-react-lite';
import authStore from './stores/authStore';
import {ROLES} from './utils/constants.js';

import CustomSideBar from "./scenes/global/CustomSidebar.jsx";
import Dashboard from "./scenes/dashboard";
import Users from "./scenes/users";
import UserForm from "./scenes/users/UserForm.jsx";
import Units from "./scenes/units/index.jsx";
import UnitForm from "./scenes/units/UnitForm.jsx";
import Vehicles from "./scenes/vehicles/index.jsx";
import VehicleForm from "./scenes/vehicles/VehicleForm.jsx";
import VehicleComponentForm from "./scenes/vehicles/VehicleComponentForm.jsx";
import Repairs from "./scenes/repairs/index.jsx";
import RepairComponentForm from "./scenes/repairs/RepairComponentForm.jsx";
import RepairForm from "./scenes/repairs/RepairForm.jsx";
import Maintenances from "./scenes/maintenances/index.jsx";
import MaintenanceForm from "./scenes/maintenances/MaintenanceForm.jsx";
import MileageLogs from "./scenes/mileageLogs/index.jsx";
import MileageLogForm from "./scenes/mileageLogs/MileageLogForm.jsx";
import Calendar from "./scenes/calendar";
import ProfileForm from "./scenes/profile/index.jsx";
import LoginPage from './scenes/LoginPage/LoginPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute/ProtectedRoute.jsx';
import NotFoundPage from "./scenes/NotFoundPage/NotFoundPage.jsx";

const App = observer(() => {
    const [theme, colorMode] = useMode();


    const allAuthenticatedRoles = Object.values(ROLES);
    const commandRoles = [ROLES.COMMANDER, ROLES.UNIT_COMMANDER];
    const commandAndDutyStaffRoles = [ROLES.COMMANDER, ROLES.UNIT_COMMANDER, ROLES.DUTY_STAFF];

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <div className="app">
                    {authStore.isAuthenticated && <CustomSideBar/>}
                    <main className="content">
                        <Routes>
                            <Route
                                path="/login"
                                element={!authStore.isAuthenticated ? <LoginPage/> : <Navigate to="/" replace/>}
                            />


                            <Route element={<ProtectedRoute allowedRoles={allAuthenticatedRoles}/>}>
                                <Route path="/profile" element={<ProfileForm/>}/>
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}/>}>
                                <Route path="/users" element={<Users/>}/>
                                <Route path="/users/create-user" element={<UserForm/>}/>
                                <Route path="/users/edit-user/:userId" element={<UserForm/>}/>
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.COMMANDER]}/>}>
                                <Route path="/units" element={<Units/>}/>
                            </Route>
                            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}/>}>
                                <Route path="/units/create-unit" element={
                                    <UnitForm/>}/>
                                <Route path="/units/edit-unit/:unitId" element={
                                    <UnitForm/>}/>
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={commandAndDutyStaffRoles}/>}>
                                <Route path="/mileage-logs" element={<MileageLogs/>}/>
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={[ROLES.DUTY_STAFF]}/>}>
                                <Route path="/mileage-logs/create-mileage-log" element={<MileageLogForm/>}/>
                                <Route path="/mileage-logs/edit-mileage-log/:mileageLogId" element={<MileageLogForm/>}/>
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={commandRoles}/>}>
                                <Route path="/maintenances" element={<Maintenances/>}/>
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={[ROLES.UNIT_COMMANDER]}/>}>
                                <Route path="/maintenances/create-maintenance" element={<MaintenanceForm/>}/>
                                <Route path="/maintenances/edit-maintenance/:maintenanceId"
                                       element={<MaintenanceForm/>}/>
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={commandRoles}/>}>
                                <Route path="/repairs" element={<Repairs/>}/>
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={[ROLES.UNIT_COMMANDER]}/>}>
                                <Route path="/repairs/create-repair">
                                    <Route index element={<RepairForm/>}/>
                                    <Route path="repair-components/create-repair" element={<RepairComponentForm/>}/>
                                    <Route path="repair-components/edit-repair/:repairComponentId"
                                           element={<RepairComponentForm/>}/>
                                </Route>
                                <Route path="/repairs/edit-repair/:repairId">
                                    <Route index element={<RepairForm/>}/>
                                    <Route path="repair-components/create-repair" element={<RepairComponentForm/>}/>
                                    <Route path="repair-components/edit-repair/:repairComponentId"
                                           element={<RepairComponentForm/>}/>
                                </Route>
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={commandRoles}/>}>
                                <Route path="/vehicles" element={<Vehicles/>}/>
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={[ROLES.UNIT_COMMANDER]}/>}>
                                <Route path="/vehicles/create-vehicle">
                                    <Route index element={<VehicleForm/>}/>
                                    <Route path="vehicle-components/create-component"
                                           element={<VehicleComponentForm/>}/>
                                    <Route path="vehicle-components/edit-component/:vehicleComponentId"
                                           element={<VehicleComponentForm/>}/>
                                </Route>
                                <Route path="/vehicles/edit-vehicle/:vehicleId">
                                    <Route index element={<VehicleForm/>}/>
                                    <Route path="vehicle-components/create-component"
                                           element={<VehicleComponentForm/>}/>
                                    <Route path="vehicle-components/edit-component/:vehicleComponentId"
                                           element={<VehicleComponentForm/>}/>
                                </Route>
                            </Route>


                            <Route element={<ProtectedRoute
                                allowedRoles={commandRoles}/>}>
                                <Route path="/" element={<Dashboard/>}/>
                                <Route path="/calendar" element={<Calendar/>}/>
                            </Route>

                            <Route path="*" element={
                                authStore.isAuthenticated
                                    ? <NotFoundPage/>
                                    : <Navigate to="/login" replace/>
                            }/>
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
});

export default App;