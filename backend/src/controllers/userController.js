const {userToDto} = require("../dtos/user.dto");
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../services/trainingSessionService");

module.exports = {
    async getAll(req, res) {
        const users = await getAllUsers();
        if (!users) {
            res.status(404).send({});
        } else {
            res.json(users.map(user => userToDto(user)));
        }
    },

    async getById(req, res) {
        const userDTO = await getUserById(req.params.id);
        if (!userDTO) {
            res.status(404).send({});
        } else {
            res.json(userToDto(userDTO));
        }
    },

    async create(req, res) {
        const newUser = await createUser(req.body);
        res.status(201).json(userToDto(newUser));
    },

    async update(req, res) {
        const userDTO = await updateUser(req.params.id, req.body);
        res.json(userToDto(userDTO));
    },

    async delete(req, res) {
        await deleteUser(req.params.id);
        res.status(204).send();
    }
};
