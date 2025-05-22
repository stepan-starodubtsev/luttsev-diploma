const express = require('express');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

// Middleware
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
const {ROLES} = require('./config/constants');

// Routers
const authRouter = require('./routes/authRouter');
const maintenanceRouter = require('./routes/maintenanceRouter');
const repairComponentRouter = require('./routes/repairComponentRouter');
const repairRouter = require('./routes/repairRouter');
const userRouter = require('./routes/userRouter');
const unitRouter = require('./routes/unitRouter');
const vehicleRouter = require('./routes/vehicleRouter');
const mileageLogRouter = require('./routes/mileageLogRouter');
const vehicleComponentRouter = require('./routes/vehicleComponentRouter');

app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'swagger.json'), 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Public Routes ---
app.use('/api/auth', authRouter);

// --- Protected Routes ---
app.use(authMiddleware);

// --- Role-Based Access ---


// 1. /api/users
const adminOnlyUserOperationsPermissions = {
    [ROLES.ADMIN]: {methods: '*'},
    [ROLES.COMMANDER]: {methods: 'PUT'},
    [ROLES.UNIT_COMMANDER]: {methods: 'PUT'},
    [ROLES.DUTY_STAFF]: {methods: 'PUT'},
};

app.use('/api/users',
    roleMiddleware(adminOnlyUserOperationsPermissions),
    userRouter
);


// 2. /api/units
const unitsAccessPermissions = {
    [ROLES.ADMIN]: {methods: '*'},
    [ROLES.COMMANDER]: {methods: ['GET']},
    [ROLES.UNIT_COMMANDER]: {methods: ['GET']},
};

const checkUnitsAccess = (req, res, next) => {
    const userRole = req.user.user.role;
    if (userRole !== ROLES.DUTY_STAFF) {
        return next();
    }
    return res.status(403).json({message: `Access Denied: Your role (${userRole}) cannot access ${req.baseUrl}.`});
};
app.use('/api/units', checkUnitsAccess, roleMiddleware(unitsAccessPermissions), unitRouter);


// 3. /api/mileage-logs
const mileageLogAccessPermissions = {
    [ROLES.UNIT_COMMANDER]: {methods: '*'},
    [ROLES.COMMANDER]: {methods: '*'},
    [ROLES.DUTY_STAFF]: {methods: '*'}
};
const allowNonAdminOnlyForMileageLogs = (req, res, next) => {
    if (req.user.user.role === ROLES.ADMIN) {
        return res.status(403).json({message: `Access Denied: ADMIN cannot access ${req.baseUrl}.`});
    }
    next();
};
app.use('/api/mileage-logs',
    allowNonAdminOnlyForMileageLogs,
    roleMiddleware(mileageLogAccessPermissions),
    mileageLogRouter
);

// 4. COMMANDER & UNIT_COMMANDER
const generalPermissions = {
    [ROLES.COMMANDER]: {
        methods: ['GET'],
        forbiddenRoutes: ['/api/users', '/api/units']
    },
    [ROLES.UNIT_COMMANDER]: {
        methods: '*',
        forbiddenRoutes: ['/api/users', '/api/units']
    }
};

const generalRoutes = [
    '/api/maintenance',
    '/api/repair-components',
    '/api/repairs',
    '/api/vehicles',
    '/api/vehicle-components'
];

app.use(generalRoutes, roleMiddleware(generalPermissions));

app.use('/api/maintenance', maintenanceRouter);
app.use('/api/repair-components', repairComponentRouter);
app.use('/api/repairs', repairRouter);
app.use('/api/vehicles', vehicleRouter);
app.use('/api/vehicle-components', vehicleComponentRouter);


app.get('/api', (req, res) => res.send('API is running... (Authenticated)'));

app.use((error, req, res, next) => {
    console.error("Error Handler:", error.name, error.message, error.stack);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    res.status(statusCode).json({
        status: statusCode,
        message: message,
        ...(process.env.NODE_ENV === 'development' && {stack: error.stack})
    });
});

module.exports = app;