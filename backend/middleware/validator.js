const { check, validationResult } = require('express-validator');

/*
Validate user data from req.body during registration process 
*/
exports.validateUser = [
	check('Firstname')
		.trim()
		.not()
		.isEmpty()
		.withMessage('First name is missing!')
		.isLength({ min: 3 })
		.withMessage('First name must be at least 3 characters long'),
	check('Lastname')
		.trim()
		.not()
		.isEmpty()
		.withMessage('Last name is missing!')
		.isLength({ min: 3 })
		.withMessage('Last name must be at least 3 characters long'),
	check('Email').normalizeEmail().isEmail().withMessage('Email is invalid'),
	check('Password')
		.trim()
		.not()
		.isEmpty()
		.withMessage('Password is missing!')
		.isLength({ min: 8, max: 20 })
		.withMessage('Password must be 8 to 20 characters long'),
];

/*
Returns validation results
If no errors proceed to next function
*/

exports.validateFunc = (req, res, next) => {
	const error = validationResult(req).array();

	if (!error.length) return next();

	res.status(400).json({ success: false, error: error[0].msg });
};
