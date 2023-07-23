const {
	createTag,
	deleteTag,
	assignTagToUser,
	viewAllTags,
	viewUserTags,
} = require('../controllers/tags');

const router = require('express').Router();

// Schemas

/**
 * A Tag
 * @typedef {object} Tag
 * @property {integer} Id.required - Id of project
 * @property {string} Tag.required - User tag (Developer, Designer ...)
 */

// --- Tags ---

// Create tag

/**
 * POST /api/users/create-tag
 * @tags Tags
 * @summary Create tag
 * @param {string} Token.header.required - JWT Token
 * @param {string} Name.form.required - Tag name - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "msg": "Tag succesfully created"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Tag name mising"
 * }
 */

router.post('/create-tag', createTag);

// Delete tag

/**
 * DELETE /api/users/delete-tag
 * @tags Tags
 * @summary Delete tag
 * @param {string} Token.header.required - JWT Token
 * @param {string} Name.form.required - Name of tag to delete - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "msg": "Tag deleted succesfully"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Tag not found"
 * }
 */

router.delete('/delete-tag', deleteTag);

// View all tags to know which to assing to user

/**
 * GET /api/users/view-all-tags
 * @tags Tags
 * @summary View all tags
 * @param {string} Token.header.required - JWT Token
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "data": [
 *   {
 *     "Tag": "Developer"
 *   },
 *   {
 *     "Tag": "Designer"
 *   }
 * ]
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "No tags found"
 * }
 */

router.get('/view-all-tags', viewAllTags);

// Assign tag to user

/**
 * POST /api/users/add-tag
 * @tags Tags
 * @summary Assign tag for user
 * @param {string} Token.header.required - JWT Token
 * @param {integer} TagId.form.required - Tag id - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "msg": "Tag assigned to user"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "User id missing"
 * }
 */

router.post('/add-tag', assignTagToUser);

// View all tags for user

/**
 * GET /api/users/view-tags
 * @tags Tags
 * @summary View tags for user
 * @param {string} Token.header.required - JWT Token
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "data": [
 *   {
 *     "Tag": "Developer"
 *   },
 *   {
 *     "Tag": "Designer"
 *   }
 * ]
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "User id mising"
 * }
 */

router.get('/view-tags', viewUserTags);

module.exports = router;
