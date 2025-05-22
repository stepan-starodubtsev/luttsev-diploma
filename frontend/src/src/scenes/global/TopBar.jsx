import {Box, IconButton, Stack, Tooltip, useTheme} from "@mui/material";
import {ColorModeContext, tokens} from "../../theme.js";
import {useContext} from "react";

import {DarkModeOutlined, LightModeOutlined, PersonOutlined} from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import {Link} from "react-router-dom";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import {authStore} from "../../stores/authStore.js";
import {ROLES} from "../../utils/constants.js";

const TopBar = ({headerBox}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    const handleLogout = () => {
        authStore.logout();
    };

    return (
        <Box display="flex" justifyContent={headerBox ? "space-between" : "end"}
             mt={headerBox ? 0 : 6}
             mr={headerBox ? 0 : 2.5}
             p={2}>
            <>{headerBox}</>
            <Stack direction={"row"} alignItems={"center"}>
                <Tooltip title={'Змінити тему'}>
                    <IconButton onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === 'light' ?
                            <LightModeOutlined/> : <DarkModeOutlined/>}
                    </IconButton>
                </Tooltip>
                {(authStore.user.role === ROLES.UNIT_COMMANDER || authStore.user.role === ROLES.COMMANDER) ?
                    (<Tooltip title={'Календар'}>
                        <Link to={'/calendar'}>
                            <IconButton>
                                <CalendarTodayOutlinedIcon/>
                            </IconButton>
                        </Link>
                    </Tooltip>) : null}
                {(authStore.user.role === ROLES.UNIT_COMMANDER || authStore.user.role === ROLES.COMMANDER) ?
                    (<Tooltip title={'Список ТЗ'}>
                    <Link to={'/vehicles'}>
                        <IconButton>
                            <DirectionsCarIcon/>
                        </IconButton>
                    </Link>
                </Tooltip>) : null}
                <Tooltip title={'Профіль'}>
                    <Link to={'/profile'}>
                        <IconButton>
                            <PersonOutlined/>
                        </IconButton>
                    </Link>
                </Tooltip>
                <Tooltip title={'Вийти з акаунту'}>
                    <IconButton onClick={handleLogout}>
                        <LogoutIcon/>
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    )
        ;
}

export default TopBar;