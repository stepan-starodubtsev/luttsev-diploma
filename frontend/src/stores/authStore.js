import {action, computed, flow, makeObservable, observable, runInAction} from 'mobx';
import apiClient, {configureApiClientAuth} from "../utils/apiClient.js";
import {jwtDecode} from 'jwt-decode';
import vehiclesStore from "./vehiclesStore.js";
import maintenances from "../scenes/maintenances/index.jsx";
import maintenancesStore from "./maintenancesStore.js";
import repairs from "../scenes/repairs/index.jsx";
import repairsStore from "./repairsStore.js";
import mileageLogs from "../scenes/mileageLogs/index.jsx";
import mileageLogsStore from "./mileageLogsStore.js";
import unitsStore from "./unitsStore.js";
import users from "../scenes/users/index.jsx";
import usersStore from "./usersStore.js";

class AuthStore {
    user = null;
    accessToken = "";
    loading = false;
    error = null;

    constructor() {
        makeObservable(this, {
            user: observable,
            accessToken: observable,
            loading: observable,
            error: observable,
            isAuthenticated: computed,
            login: flow,
            logout: action.bound,
            validateTokenOnServer: flow,
            _setAuthDataFromToken: action,
            clearAuthData: action.bound,
            loadAuthDataFromStorage: action.bound,
        });

        configureApiClientAuth({
            getToken: () => this.accessToken,
            logout: this.logout,
        });

        this.loadAuthDataFromStorage();
    }

    get isAuthenticated() {
        return !!this.accessToken && this.accessToken !== "undefined" && this.user !== null;
    }

    _setAuthDataFromToken(tokenString, fromStorage = false) {
        if (!tokenString || tokenString === "undefined") {
            this.clearAuthData();
            return;
        }
        try {
            const decodedToken = jwtDecode(tokenString);
            console.log("Decoded JWT Payload:", decodedToken);

            let userDataFromToken;
            if (decodedToken.user && typeof decodedToken.user === 'object') {
                userDataFromToken = decodedToken.user;
            } else if (decodedToken.id && decodedToken.username && decodedToken.role) {
                userDataFromToken = {
                    id: decodedToken.id,
                    username: decodedToken.username,
                    role: decodedToken.role,
                    name: decodedToken.name || decodedToken.username,
                };
            } else {
                console.error("JWT payload does not contain expected user data structure.", decodedToken);
                this.clearAuthData();
                return;
            }

            if (!userDataFromToken.id || !userDataFromToken.username || !userDataFromToken.role) {
                console.error("Essential user data (id, username, role) missing in token payload.", userDataFromToken);
                this.clearAuthData();
                return;
            }


            this.user = userDataFromToken;
            this.accessToken = tokenString;
            this.error = null;

            if (!fromStorage) {
                localStorage.setItem("accessToken", tokenString);
                localStorage.setItem("user", JSON.stringify(this.user));
            }
            console.log("Auth data set in store from token:", { token: this.accessToken, user: this.user });

        } catch (e) {
            console.error("Failed to decode JWT or set auth data:", e);
            this.clearAuthData();
        }
    }

    clearAuthData() {
        console.log("AuthStore: Clearing authentication data.");
        this.user = null;
        this.accessToken = "";
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        this.error = null;
    }

    loadAuthDataFromStorage() {
        const storedToken = localStorage.getItem("accessToken");
        console.log("AuthStore: Loading data from storage - Token:", storedToken);

        if (storedToken && storedToken !== "undefined") {
            runInAction(() => {
                this._setAuthDataFromToken(storedToken, true);
            });

            if (this.isAuthenticated) {
                console.log("AuthStore: Data successfully loaded and decoded from storage token.");
                this.validateTokenOnServer();
            } else {
                console.warn("AuthStore: Token found in storage but failed to set auth data (e.g., decode failed).");
            }
        } else {
            console.log("AuthStore: No valid token in localStorage to load.");
            runInAction(() => this.clearAuthData());
        }
    }

    *login(username, password) {
        this.loading = true;
        this.error = null;
        try {
            const response = yield apiClient.post("/auth/login", { username, password });
            let tokenString;
            if (typeof response.data === 'string') {
                tokenString = response.data;
            } else if (response.data && typeof response.data.token === 'string') {
                tokenString = response.data.token;
            } else {
                throw new Error("Invalid token format received from login API.");
            }

            this._setAuthDataFromToken(tokenString);

        } catch (error) {
            this.error = error.response?.data?.message || error.message || "Помилка входу";
            console.error("Login failed in authStore:", this.error, error);
            this.clearAuthData();
        } finally {
            this.loading = false;
        }
    }

    *validateTokenOnServer() {
        console.log("validateTokenOnServer: Current accessToken:", this.accessToken);
        if (!this.isAuthenticated || !this.accessToken) {
            if (this.isAuthenticated || this.accessToken) this.clearAuthData();
            return;
        }
        console.log("AuthStore: Validating token on server...");
        try {
            const response = yield apiClient.get("/auth/me");
            const userDataFromServer = response.data;

            runInAction(() => {
                this.user = userDataFromServer;
                localStorage.setItem("user", JSON.stringify(this.user));
            });
            console.log("Token validated successfully on server, user data updated:", this.user);
        } catch (error) {
            console.warn("Token validation on server failed:", error.response?.data?.message || error.message);
            if (error.response?.status !== 401) {
                this.clearAuthData();
            }
        }
    }

    logout() {
        this.clearAuthData();
        vehiclesStore.vehicles = [];
        maintenancesStore.maintenances = [];
        repairsStore.repairs = [];
        mileageLogsStore.mileageLogs = [];
        unitsStore.units = [];
        usersStore.users = [];
    }

    get userRole() {
        return this.user ? this.user.role : null;
    }
}

const authStoreInstance = new AuthStore();
export default authStoreInstance;
export { authStoreInstance as authStore };