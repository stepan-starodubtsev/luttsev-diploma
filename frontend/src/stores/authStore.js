// // frontend/src/src/stores/authStore.js
// import { action, computed, flow, makeObservable, observable, runInAction } from 'mobx';
// import apiClient, { configureApiClientAuth } from "../utils/apiClient.js";
// // import { jwtDecode } from 'jwt-decode'; // Може бути не потрібним зараз
// import { ROLES } from '../utils/constants.js'; // Для визначення ролі за замовчуванням
//
// // ... (інші імпорти сторів для logout)
//
// class AuthStore {
//     // ТИМЧАСОВО: Встановлюємо користувача за замовчуванням для тестування
//     user = {
//         id: 1, // Приклад ID
//         // email: 'test_admin',
//         email: 'test_admin@sport.local', // Змінено email на email для узгодження з моделлю User
//         first_name: 'Тестовий',
//         last_name: 'Адміністратор',
//         role: ROLES.ADMIN, // Або інша роль для тестування різних прав доступу
//     };
//     accessToken = "fake-test-token"; // Тимчасовий токен
//     loading = false;
//     error = null;
//
//     constructor() {
//         makeObservable(this, {
//             user: observable,
//             accessToken: observable,
//             loading: observable,
//             error: observable,
//             isAuthenticated: computed,
//             login: flow, // Залишимо, але не будемо використовувати для входу під час тесту
//             logout: action.bound,
//             // validateTokenOnServer: flow, // Можна закоментувати
//             _setAuthDataFromToken: action,
//             clearAuthData: action.bound,
//             loadAuthDataFromStorage: action.bound,
//         });
//
//         configureApiClientAuth({
//             getToken: () => this.accessToken,
//             logout: this.logout,
//         });
//
//         // this.loadAuthDataFromStorage(); // Можна закоментувати, щоб уникнути перезапису
//         console.log("AuthStore initialized for testing with mock user:", this.user);
//     }
//
//     get isAuthenticated() {
//         // ТИМЧАСОВО: Завжди true для тестування
//         return true;
//         // return !!this.accessToken && this.accessToken !== "undefined" && this.user !== null;
//     }
//
//     _setAuthDataFromToken(tokenString, fromStorage = false) {
//         // Ця логіка може бути не потрібна під час тестування з захардкодженим користувачем
//         // ...
//         // Або можна залишити, якщо ви все ще хочете імітувати отримання токена
//         if (!tokenString || tokenString === "undefined" || tokenString === "fake-test-token") {
//             // Якщо це наш фейковий токен, нічого не робимо або підтверджуємо фейкового користувача
//             if (!this.user && tokenString === "fake-test-token") { // Встановлюємо фейкового, якщо ще не встановлено
//                 this.user = { id: 1, email: 'test_admin@sport.local', first_name: 'Тестовий', last_name: 'Адміністратор', role: ROLES.ADMIN };
//                 this.accessToken = "fake-test-token";
//                 console.log("AuthStore: Mock user set with fake token.");
//             }
//             return;
//         }
//         // ... (решта логіки jwtDecode, якщо потрібна для інших сценаріїв)
//     }
//
//     clearAuthData() {
//         console.log("AuthStore: Clearing authentication data.");
//         this.user = null; // Повертаємо до null
//         this.accessToken = "";
//         localStorage.removeItem("user");
//         localStorage.removeItem("accessToken");
//         this.error = null;
//         // Для тестування, можливо, ви не захочете очищати localStorage, щоб не вводити дані знову
//         // Для повного тестування без автентифікації, встановіть user та accessToken в початкові тестові значення:
//         // this.user = { id: 1, email: 'test_admin@sport.local', first_name: 'Тестовий', last_name: 'Адміністратор', role: ROLES.ADMIN };
//         // this.accessToken = "fake-test-token";
//     }
//
//     loadAuthDataFromStorage() {
//         // ТИМЧАСОВО: Не завантажуємо з localStorage, використовуємо захардкоджені дані
//         console.log("AuthStore: Skipping loadAuthDataFromStorage during no-auth testing.");
//         if (!this.isAuthenticated && this.accessToken === "fake-test-token" && this.user) {
//             // Вже ініціалізовано з тестовими даними
//             return;
//         }
//         // Якщо хочете повністю емулювати відсутність даних при старті:
//         // this.clearAuthData();
//         // Або одразу встановити тестового користувача:
//         this._setAuthDataFromToken(this.accessToken, true);
//
//     }
//
//     *login(emailOrEmail, password) { // Змінено email на emailOrEmail
//         this.loading = true;
//         this.error = null;
//         try {
//             // Для тестування без бекенду можна закоментувати виклик API
//             console.warn("AuthStore: Actual login API call is disabled for testing.");
//             // const response = yield apiClient.post("/auth/login", { email: emailOrEmail, password }); // Змінено email на email
//             // let tokenString;
//             // if (typeof response.data === 'string') {
//             //     tokenString = response.data;
//             // } else if (response.data && typeof response.data.token === 'string') {
//             //     tokenString = response.data.token;
//             // } else {
//             //     throw new Error("Invalid token format received from login API.");
//             // }
//             // this._setAuthDataFromToken(tokenString);
//
//             // ТИМЧАСОВО: просто встановлюємо тестового користувача
//             this.user = { id: 1, email: emailOrEmail, first_name: 'Тестовий', last_name: 'Користувач', role: ROLES.ADMIN };
//             this.accessToken = "fake-test-token";
//             localStorage.setItem("accessToken", this.accessToken);
//             localStorage.setItem("user", JSON.stringify(this.user));
//
//
//         } catch (error) {
//             this.error = error.response?.data?.message || error.message || "Помилка входу (тест)";
//             console.error("Login failed in authStore (test mode):", this.error, error);
//             this.clearAuthData(); // У разі помилки все одно очищаємо
//         } finally {
//             this.loading = false;
//         }
//     }
//
//     *validateTokenOnServer() {
//         // ТИМЧАСОВО: Не валідуємо токен на сервері
//         console.warn("AuthStore: Skipping token validation on server during no-auth testing.");
//         if (!this.user && this.accessToken === "fake-test-token") { // Якщо користувач злетів, але є фейк токен
//             this.user = { id: 1, email: 'test_admin@sport.local', first_name: 'Тестовий', last_name: 'Адміністратор', role: ROLES.ADMIN };
//         }
//         yield Promise.resolve(); // Імітація успішної валідації
//         return;
//         // ... (стара логіка закоментована)
//     }
//
//     logout() {
//         this.clearAuthData();
//         // При логауті під час тестування, можна знову встановити дефолтного користувача
//         // або повністю очистити, щоб перевірити редирект на логін
//         // this.user = { id: 1, email: 'test_admin@sport.local', first_name: 'Тестовий', last_name: 'Адміністратор', role: ROLES.ADMIN };
//         // this.accessToken = "fake-test-token";
//
//         // ... (очищення інших сторів)
//     }
//
//     get userRole() {
//         return this.user ? this.user.role : null;
//     }
// }
//
// const authStoreInstance = new AuthStore();
// export default authStoreInstance;
// export { authStoreInstance as authStore };


import {action, computed, flow, makeObservable, observable, runInAction} from 'mobx';
import apiClient, {configureApiClientAuth} from "../utils/apiClient.js";
import {jwtDecode} from 'jwt-decode';
// import maintenancesStore from "./maintenancesStore.js";
// import repairs from "../scenes/military_personnel/MilitaryPersonnelListPage.jsx";
// import repairsStore from "./repairsStore.js";
// import mileageLogs from "../scenes/locations/LocationListPage.jsx";
// import mileageLogsStore from "./mileageLogsStore.js";
// import unitStore from "./unitStore.js";
// import users from "../scenes/users/UserListPage.jsx";
// import userStore from "./userStore.js";

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
            } else if (decodedToken.user_id && decodedToken.email && decodedToken.role) {
                userDataFromToken = {
                    user_id: decodedToken.user_id,
                    email: decodedToken.email,
                    role: decodedToken.role,
                    name: decodedToken.name || decodedToken.email,
                };
            } else {
                console.error("JWT payload does not contain expected user data structure.", decodedToken);
                this.clearAuthData();
                return;
            }

            if (!userDataFromToken.user_id || !userDataFromToken.email || !userDataFromToken.role) {
                console.error("Essential user data (id, email, role) missing in token payload.", userDataFromToken);
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

    *login(email, password) {
        this.loading = true;
        this.error = null;
        try {
            const response = yield apiClient.post("/api/auth/login", { email, password });
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
            const response = yield apiClient.get("api/auth/me");
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
    }

    get userRole() {
        return this.user ? this.user.role : null;
    }
}

const authStoreInstance = new AuthStore();
export default authStoreInstance;
export { authStoreInstance as authStore };