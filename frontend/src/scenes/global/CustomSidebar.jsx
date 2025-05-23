import {useEffect, useState} from "react";
import {Menu, MenuItem, Sidebar, SubMenu,} from "react-pro-sidebar";
import {Box, IconButton, Typography, useTheme} from "@mui/material";
import {Link, useLocation} from "react-router-dom";
import {tokens} from "../../theme";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CarRentalIcon from '@mui/icons-material/CarRental';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ScheduleIcon from '@mui/icons-material/Schedule';
import ApartmentIcon from '@mui/icons-material/Apartment';
import {authStore} from "../../stores/authStore.js";
import {ROLES, UserRoles} from "../../utils/constants.js";
import unitStore from "../../stores/unitStore.js";

const Item = ({title, to, icon}) => {
    const {pathname} = useLocation();
    return (
        <MenuItem
            active={pathname === to}
            icon={icon}
            component={<Link to={to}/>}
        >
            {title}
        </MenuItem>
    );
};


const CustomSidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    useEffect(() => {
        const fetchUnits = async () => {
        if (!unitStore.units.length && !unitStore.loading) await unitStore.loadUnits();
        }
        fetchUnits();
    }, []);
    return (
        <Box>
            <Sidebar
                collapsed={isCollapsed}
                backgroundColor={theme.palette.mode === "dark" ? colors.primary[400] : null}
                rootStyles={{
                    height: "100%",
                    border: "none",
                    minHeight: "100%",
                }}
            >
                <Menu
                    menuItemStyles={(theme.palette.mode === "dark") ? {
                        button: ({active}) => {
                            return {
                                color: active && colors.grey[400],
                                backgroundColor: colors.primary[400],
                                "&:hover": {
                                    color: "#868dfb",
                                    backgroundColor: colors.primary[500] + " !important",
                                }
                            }
                        },
                    } : {
                        button: ({active}) => {
                            return {
                                color: active && colors.grey[600],
                            }
                        },
                    }}>
                    <MenuItem
                        icon={isCollapsed ? <MenuOutlinedIcon/> : undefined}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{margin: "10px 0 20px 0", color: colors.grey[100]}}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Typography variant="h3" color={colors.grey[100]}>
                                    Адмін панель
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon/>
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {!isCollapsed && (
                        <Box mb="25px">
                            <Box textAlign="center">
                                <Typography
                                    variant="h3"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                    sx={{m: "10px 0 0 0"}}
                                >
                                    {authStore.user?.name}
                                </Typography>
                                <Typography variant="h5" color={colors.greenAccent[500]}>
                                    {authStore.user?.username}
                                </Typography>
                                <Typography variant="h5" mt={1} color={colors.greenAccent[300]}>
                                    {UserRoles
                                        .filter(role => authStore.user.role === role.value)[0].label}
                                </Typography>
                                <Typography variant="h5" mt={1} color={colors.greenAccent[300]}>
                                    {unitStore.units.filter(unit =>
                                        unit.commanderId === authStore.user.id
                                    )[0]?.name}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box pl={isCollapsed ? 0 : "10%"}>
                        {((authStore.user?.role === ROLES.UNIT_COMMANDER) ||
                            (authStore.user?.role === ROLES.COMMANDER))
                            ? <Item title="Статистика" to="/" icon={<HomeOutlinedIcon/>}/>
                            : null}

                        {(authStore.user?.role === ROLES.ADMIN)
                            ? <Item title="Користувачі" to="/users" icon={<PeopleOutlinedIcon/>}/>
                            : null}

                        {((authStore.user?.role === ROLES.ADMIN) ||
                            (authStore.user?.role === ROLES.COMMANDER))
                            ? <Item title="Підрозділи" to="/units" icon={<ApartmentIcon/>}/>
                            : null}

                        {((authStore.user?.role === ROLES.UNIT_COMMANDER) ||
                            (authStore.user?.role === ROLES.COMMANDER) ||
                            authStore.user?.role === ROLES.DUTY_STAFF) ?
                            (<SubMenu label="Про ТЗ" icon={<DirectionsCarIcon/>}>
                                {((authStore.user?.role === ROLES.UNIT_COMMANDER) ||
                                    (authStore.user?.role === ROLES.COMMANDER))
                                    ? (<>
                                        <Item title="Список ТЗ" to="/vehicles" icon={<DirectionsCarIcon/>}/>
                                        <Item title="Ремонти ТЗ" to="/repairs" icon={<CarRepairIcon/>}/>
                                        <Item title="ТО ТЗ" to="/maintenances" icon={<CarRentalIcon/>}/>
                                    </>)
                                    : null}
                                {(authStore.user?.role !== ROLES.ADMIN)
                                    ? <Item title="Облік пробігу" to="/mileage-logs" icon={<ScheduleIcon/>}/>
                                    : null}
                            </SubMenu>) : null}

                        {((authStore.user?.role === ROLES.UNIT_COMMANDER) ||
                            (authStore.user?.role === ROLES.COMMANDER))
                            ? <Item title="Календар" to="/calendar" icon={<CalendarTodayOutlinedIcon/>}/>
                            : null
                        }

                        {authStore.isAuthenticated &&
                            <Item title="Профіль" to="/profile" icon={<PersonOutlinedIcon/>}/>}
                    </Box>
                </Menu>
            </Sidebar>
        </Box>
    )
        ;
};

export default CustomSidebar;
