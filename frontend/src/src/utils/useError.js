import {useEffect} from "react";
import usersStore from "../stores/usersStore.js";

const useError = () => {
    useEffect(() => {
        if (usersStore.error) {
            console.error(usersStore.error);
        }
    }, [usersStore.error])
}

export default useError;
