const app = require('./app');
const sequelize = require('./config/settingsDB');

const PORT = 5001;

const start = async () => {
    try {
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

start();
