const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sendResponse } = require('../utils/helper');

exports.checkEmail = async (req, res, next) => {
	const { Email } = req.body;
	const checkEmailQuery = `SELECT * FROM Users WHERE Email = '${Email}'`;

	if (!Email.trim()) {
		return sendResponse(400, 'Email is missing', res);
	}

	db.query(checkEmailQuery, (err, result) => {
		if (result) {
			if (result.length < 1) {
				next();
			} else {
				return sendResponse(400, 'Email is already taken', res);
			}
		}
	});
};

exports.checkUsername = async (req, res, next) => {
	const { Username } = req.body;
	const checkEmailQuery = `SELECT * FROM Users WHERE Username = '${Username}'`;

	if (!Username.trim()) {
		return sendResponse(400, 'Username is missing', res);
	}
	db.query(checkEmailQuery, (err, result) => {
		if (result) {
			if (result.length < 1) {
				next();
			} else {
				return sendResponse(400, 'Username is already taken', res);
			}
		}
	});
};

/*
Register user
- Firstname
- Lastname
- Username
- Email
- Password
- Birthdate
- Picture
- Description
*/

exports.createUser = async (req, res, next) => {
	const {
		Firstname,
		Lastname,
		Username,
		Email,
		Password,
		Birthdate,
		Picture,
		Description,
	} = req.body;

	const hash = await bcrypt.hash(Password, 8);
	const uid = uuidv4();
	const sqlInsertUser = `INSERT INTO Users (id, Firstname, Lastname, Username, Email, Password, Birthdate, Picture, Description) VALUES ('${uid}', '${Firstname}', '${Lastname}', '${Username}', '${Email}', '${hash}', '${Birthdate}', '${Picture}', '${Description}')`;

	db.query(sqlInsertUser, (err, result) => {
		if (err) {
			return sendResponse(400, err, res);
		}
		return res
			.status(200)
			.send({ success: true, msg: 'User registered succesfully' });
	});
};

/* 
Login user
- Email
- Password

Returns json web token if login is succesfull used for other actions to verify user
*/

exports.login = async (req, res) => {
	const { username, password } = req.body;

	// Check if data is passed
	if (!username.trim() || !password.trim()) {
		return sendResponse(400, 'Username/password missing!', res);
	} else {
		// Check if user with that email exists
		const findByEmailQuery = `SELECT * FROM Users WHERE Username='${username}'`;

		db.query(findByEmailQuery, async (err, result) => {
			if (err) {
				return sendResponse(400, err, res);
			}

			const user = result[0];
			console.log(user);
			// Check if user is found
			if (!user) {
				return sendResponse(400, 'User not found', res);
			}

			// Compare given password to hashed password in database
			const userPassword = user.Password;
			const isPasswordValid = await bcrypt.compareSync(password, userPassword);

			// Check if password is valid
			if (!isPasswordValid) {
				return sendResponse(400, 'Wrong password', res);
			}

			const accessToken = jwt.sign(
				{
					uid: user.Id,
					email: user.Email,
					firstName: user.Firstname,
					lastName: user.Lastname,
					password: user.Password,
				},
				process.env.JWT_SECRET
			);

			console.log(accessToken);

			return res.status(200).send({
				success: true,
				data: {
					token: accessToken,
				},
			});
		});
	}
};
