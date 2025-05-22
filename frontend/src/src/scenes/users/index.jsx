import Header from "../../components/Header.jsx";
import {Box, useTheme} from "@mui/material";
import {tokens} from "../../theme.js";
import * as React from "react";
import {useEffect} from "react";
import {UserRoles} from "../../utils/constants.js";
import usersStore from "../../stores/usersStore.js";
import {observer} from "mobx-react-lite";
import useError from "../../utils/useError.js";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid.jsx";
import TopBar from "../global/TopBar.jsx";

const Users = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        {field: 'id', headerName: 'ID'},
        {field: 'name', headerName: 'ПІБ', flex: 1, cellClassName: "name-column--cell"},
        {field: 'username', headerName: 'Логін', flex: 1},
        {
            field: 'role', headerName: 'Рівень доступу', flex: 1,
            type: 'singleSelect', valueOptions: UserRoles,
        },
    ];

    useEffect(() => {
        if (!usersStore.users.length && !usersStore.loading) usersStore.loadUsers();
    }, []);
    useError();

    return (
        <Box m={"20px"}>
            <TopBar headerBox={(
                <Header title={"КОРИСТУВАЧІ"} subtitle={"Керування користувачами"}/>
            )}/>
            <Box>
                <CustomDataGrid columns={columns}
                                rows={usersStore.users}
                                addEntityUrl={"/users/create-user"}
                                editEntityUrl={"/users/edit-user"}
                                deleteHandler={usersStore.removeUser.bind(usersStore)}

                ></CustomDataGrid>
            </Box>
        </Box>
    )
        ;
}

export default observer(Users);