import {makeAutoObservable, runInAction} from 'mobx';
import {createUser, deleteUser, getUserById, getUsers, updateUser,} from '../services/UserService.js';

class UsersStore {
    users = [];
    selectedUser = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    async loadUsers() {
        this.loading = true;
        try {
            const data = await getUsers();
            if (data) {
                runInAction(() => {
                    this.users = data;
                });
            }
        } catch (error) {
            runInAction(() => {
                this.error = error;
            });
        } finally {
            this.loading = false;
        }
    }

    async loadUserById(userId) {
        try {
            const user = await getUserById(userId);
            runInAction(() => {
                this.selectedUser = user;
            });
        } catch (error) {
            this.error = error;
        }
    }

    async addUser(newUser) {
        try {
            const created = await createUser(newUser);
            runInAction(() => {
                this.users.push(created);
            });
        } catch (error) {
            this.error = error;
        }
    }

    async updateUser(userId, updatedUser) {
        try {
            const updated = await updateUser(userId, updatedUser);
            runInAction(() => {
                this.users = this.users.map((u) =>
                    u.id === userId ? updated : u
                );
            });
        } catch (error) {
            this.error = error;
        }
    }

    async removeUser(userId) {
        try {
            await deleteUser(userId);
            runInAction(() => {
                this.users = this.users.filter((u) => u.id !== userId);
            });
        } catch (error) {
            this.error = error;
        }
    }
}

const usersStore = new UsersStore();
export default usersStore;
