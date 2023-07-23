const {
	createProject,
	viewProjectInfo,
	searchProject,
	joinProject,
	leaveProject,
	viewMyProjects,
	favorite,
	unfavorite,
	viewFavorites,
} = require('../controllers/projects');

const {
	createTaskCategory,
	viewAllTaskCategories,
	createTask,
	editTask,
	assignTaskToProject,
} = require('../controllers/projects');

const router = require('express').Router();

// Schemas

/**
 * A Project
 * @typedef {object} Project
 * @property {integer} ProjectId.required - Id of project
 * @property {string} Name.required - Project name
 * @property {string} Description.required - Description of project
 * @property {string} Icon.required - Icon of project (for sidebar)
 */

/**
 * A Task
 * @typedef {object} Task
 * @property {integer} Id.required - Id of project
 * @property {string} Name.required - Task name
 * @property {string} Description.required - Description of project task
 * @property {string} Category.required - Category of task category (complete, in development ...)
 */

// --- Projects ---

// Create project

/**
 * POST /api/projects/create-project
 * @tags Projects
 * @summary Create a project
 * @param {string} Token.header.required - JWT Token
 * @param {string} Name.form.required - Project name - application/x-www-form-urlencoded
 * @param {string} Description.form.required - Project description - application/x-www-form-urlencoded
 * @param {string} Icon.form - Icon for project to be shown in sidebar (icon name) - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "msg": "Project created sucesfully"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Project name missing"
 * }
 */

router.post('/create-project', createProject);

// View project info by id

/**
 * POST /api/projects/view-project-info
 * @tags Projects
 * @summary View project info by id
 * @param {string} Token.header.required - JWT Token
 * @param {string} ProjectId.form.required - Project id - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "data": [
 *   {
 *     "Name": "Project 1",
 *     "Description": "Project 1 description",
 *     "Icon": "Square"
 *   },
 *   {
 *     "Name": "Project 2",
 *     "Description": "Project 2 description",
 *     "Icon": "Circle"
 *   }
 * ]
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Project id missing"
 * }
 */

router.post('/view-project-info', viewProjectInfo);

// Search project by name

/**
 * POST /api/projects/search-project
 * @tags Projects
 * @summary Search project by query
 * @param {string} Token.header.required - JWT Token
 * @param {string} Query.form.required - Search query - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "data": [
 *   {
 *     "Name": "Project 1",
 *     "Description": "Project 1 description",
 *     "Icon": "Square"
 *   },
 *   {
 *     "Name": "Project 2",
 *     "Description": "Project 2 description",
 *     "Icon": "Circle"
 *   }
 * ]
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "No projects found"
 * }
 */

router.post('/search-project', searchProject);

// Assign user to project

/**
 * POST /api/projects/join-project
 * @tags Projects
 * @summary Join project
 * @param {string} Token.header.required - JWT Token
 * @param {string} ProjectId.form.required - Project Id - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "msg": "Project joined sucesfully"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Project not found"
 * }
 */

router.post('/join-project', joinProject);

// Leave project

/**
 * DELETE /api/projects/leave-project
 * @tags Projects
 * @summary Leave project
 * @param {string} Token.header.required - JWT Token
 * @param {string} ProjectId.form.required - Project Id - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "msg": "Project removed sucesfully"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Project not found"
 * }
 */

router.delete('/leave-project', leaveProject);

// View my projects

/**
 * GET /api/projects/my-projects
 * @tags Projects
 * @summary View my projects
 * @param {string} Token.header.required - JWT Token
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "data": [
 *   {
 *     "Name": "Project 1",
 *     "Description": "Project 1 description",
 *     "Icon": "Square"
 *   },
 *   {
 *     "Name": "Project 2",
 *     "Description": "Project 2 description",
 *     "Icon": "Circle"
 *   }
 * ]
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Project not found"
 * }
 */

router.get('/my-projects', viewMyProjects);

// Pin project as favorite

/**
 * POST /api/projects/favorite
 * @tags Projects
 * @summary Favorite project
 * @param {string} Token.header.required - JWT Token
 * @param {string} ProjectId.form.required - Project Id - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "msg": "Project added to favorites"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Project not found"
 * }
 */

router.post('/favorite', favorite);

/**
 * DELETE /api/projects/unfavorite
 * @tags Projects
 * @summary Unfavorite project
 * @param {string} Token.header.required - JWT Token
 * @param {string} ProjectId.form.required - Project Id - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "msg": "Project removed from favorites"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Project not found"
 * }
 */

router.delete('/unfavorite', unfavorite);

/**
 * GET /api/projects/view-favorites
 * @tags Projects
 * @summary View favorite projects
 * @param {string} Token.header.required - JWT Token
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "msg": "Project removed from favorites"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Project not found"
 * }
 */

router.get('/view-favorites', viewFavorites);

// --- Projects tasks ---

// Create task category (completed, in development ect..)

/**
 * POST /api/projects/create-task-category
 * @tags Projects Tasks
 * @summary Create a project task category
 * @param {string} Token.header.required - JWT Token
 * @param {string} Category.form.required - Category name (ex. in development, completed) - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "msg": "Project task category sucesfully"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Category name missing"
 * }
 */

router.post('/create-task-category', createTaskCategory);

// View task categories

/**
 * GET /api/projects/view-task-categories
 * @tags Projects Tasks
 * @summary View all available task categories
 * @param {string} Token.header.required - JWT Token
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "data": [
 *   {
 *     "Category": "Done"
 *   },
 *   {
 *     "Category": "In Development"
 *   }
 * ]
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "No Project Task Categories To Display"
 * }
 */

router.get('/view-task-categories', viewAllTaskCategories);

// Create task for project

/**
 * POST /api/projects/create-task
 * @tags Projects Tasks
 * @summary Create a task for project
 * @param {string} Token.header.required - JWT Token
 * @param {string} Name.form.required - Task name - application/x-www-form-urlencoded
 * @param {string} Description.form.required - Task description - application/x-www-form-urlencoded
 * @param {string} Category.form.required - Task category id (ex. in development, completed) - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "msg": "Project task created sucesfully"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Task name missing"
 * }
 */

router.post('/create-task', createTask);

// Edit project task

// TODO

/**
 * POST /api/projects/edit-task
 * @tags Projects Tasks
 * @summary Edit task
 * @param {string} Token.header.required - JWT Token
 * @param {string} Name.form.required - Task name - application/x-www-form-urlencoded
 * @param {string} Description.form.required - Task description - application/x-www-form-urlencoded
 * @param {string} Category.form.required - Task category id (ex. in development, completed) - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "msg": "Project task changed sucesfully"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Task name missing"
 * }
 */

router.post('/edit-task', editTask);

// TODO END

// Assing project task to project

/**
 * POST /api/projects/assign-task
 * @tags Projects Tasks
 * @summary Assing task to project
 * @param {string} Token.header.required - JWT Token
 * @param {string} ProjectId.form.required - Project id - application/x-www-form-urlencoded
 * @param {string} TaskId.form.required - Task id - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "msg": "Project task assigned to project sucesfully"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Project id missing"
 * }
 */

router.post('/assign-task', assignTaskToProject);

module.exports = router;
