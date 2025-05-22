
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const catchErrorsAsync = require('../middleware/catchErrorAsync');

/**
 * @swagger
 * tags:
 * name: Auth
 * description: API for authentication
 */

// POST /api/auth/register
// requestBody:
//   required: true
//   content:
//     application/json:
//       schema:
//         type: object
//         required:
//           - name
//           - username
//           - password
//           - role
//         properties:
//           name:
//             type: string
//           username:
//             type: string
//           password:
//             type: string
//             format: password
//           role:
//             type: string
//             enum: ['UNIT_COMMANDER', 'COMMANDER', 'ADMIN', 'DUTY_STAFF']
// responses:
//   201:
//     description: User registered successfully
//     content:
//       application/json:
//         schema:
//           type: object
//           properties:
//             token:
//               type: string
//             user:
//               $ref: '#/components/schemas/UserDto'
//   400:
//     description: Bad request (e.g., user already exists, validation error)
//   500:
//     description: Server error
router.post('/register', catchErrorsAsync(register));


// POST /api/auth/login
// requestBody:
//   required: true
//   content:
//     application/json:
//       schema:
//         type: object
//         required:
//           - username
//           - password
//         properties:
//           username:
//             type: string
//           password:
//             type: string
//             format: password
// responses:
//   200:
//     description: User logged in successfully
//     content:
//       application/json:
//         schema:
//           type: object
//           properties:
//             token:
//               type: string
//             user:
//               $ref: '#/components/schemas/UserDto'
//   400:
//     description: Invalid credentials
//   401:
//     description: Invalid credentials
//   500:
//     description: Server error
router.post('/login', catchErrorsAsync(login));

/**
 * @swagger
 * /api/auth/me:
 * get:
 * summary: Get current authenticated user's data
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Current user's data
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserDto'
 * 401:
 * description: Unauthorized (token is missing or invalid)
 * 404:
 * description: User not found (e.g., user deleted after token was issued)
 * 500:
 * description: Server error
 */
router.get('/me', authMiddleware, catchErrorsAsync(getMe));

module.exports = router;