const {
	checkEmail,
	checkUsername,
	createUser,
	login,
} = require('../controllers/users');

const { validateUser, validateFunc } = require('../middleware/validator');

const router = require('express').Router();

// Schemas

/**
 * A User
 * @typedef {object} User
 * @property {string} Id.required - Id of user
 * @property {string} Description - Description of user
 * @property {string} Firstname.required - First name of user
 * @property {string} Lastname.required - Last name of user
 * @property {string} Username.required - Username of user
 * @property {string} Email.required - Email of user
 * @property {string} Password.required - Password of user
 * @property {string} Birthdate - Birth date of user
 * @property {string} Picture - Profile picture of user in url form
 */

// Register

/**
 * POST /api/users/register
 * @tags Authentication
 * @summary Registers a user account
 * @param {string} Firstname.form.required - Users first name - application/x-www-form-urlencoded
 * @param {string} Lastname.form.required - Users last name - application/x-www-form-urlencoded
 * @param {string} Username.form.required - Users username - application/x-www-form-urlencoded
 * @param {string} Email.form.required - Users email - application/x-www-form-urlencoded
 * @param {string} Password.form.required - Users password - application/x-www-form-urlencoded
 * @param {string} Description.form - Users description - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "user": {
 * 	   "id": "d73d47b8-f25c-4d95-9da2-877063435219",
 * 	   "email": "email@gmail.com"
 * 	 }
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Email is missing"
 * }
 */

router.post(
	'/register',
	validateUser,
	validateFunc,
	checkEmail,
	checkUsername,
	createUser
);

// Login

/**
 * POST /api/users/login
 * @tags Authentication
 * @summary Login user
 * @param {string} username.form.required - Users username - application/x-www-form-urlencoded
 * @param {string} password.form.required - Users password - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "user": {
 * 	   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI0MDRkY2FkNi1lN2Q0LTRhNDktODU0YS1hYTJhM2NjNzNiMzMiLCJlbWFpbCI6InBpbmdvMTUxMDIwMDJAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoiZmlyc3RuYW1lZSIsImxhc3ROYW1lIjoibGFzdG5hbWVlIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjg2NDEyNzU1fQ"
 * 	 }
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "User not found"
 * }
 */
router.post('/login', login);

module.exports = router;
