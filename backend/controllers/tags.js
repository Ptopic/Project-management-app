const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sendResponse } = require('../utils/helper');

// Tags

exports.createTag = async (req, res) => {
	const Token = req.headers.token;
	const { Name } = req.body;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}
			// Check if tag already exists
			const selectTag = `SELECT * FROM Tags WHERE Tag='${Name.trim()}'`;

			db.query(selectTag, (err, result) => {
				if (!Name.trim()) {
					return sendResponse(400, 'Name is missing', res);
				} else if (err) {
					return sendResponse(400, err, res);
				} else if (result.length > 0) {
					return sendResponse(400, 'Tag already exists', res);
				}

				const insertTag = `INSERT INTO Tags (Tag) VALUES ('${Name}')`;

				db.query(insertTag, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}
					return res
						.status(200)
						.send({ success: true, msg: 'Tag created succesfully' });
				});
			});
		});
	} else {
		return sendResponse(400, 'You need to be loged in to access that', res);
	}
};

exports.deleteTag = async (req, res) => {
	const Token = req.headers.token;
	const { Name } = req.body;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}
			// Check if tag already exists
			const selectTag = `SELECT * FROM Tags WHERE Tag='${Name.trim()}'`;

			db.query(selectTag, (err, result) => {
				if (!Name.trim()) {
					return sendResponse(400, 'Name is missing', res);
				} else if (err) {
					return sendResponse(400, err, res);
				} else if (result.length <= 0) {
					return sendResponse(400, 'Tag deosnt exists', res);
				}

				const deleteTag = `DELETE FROM Tags WHERE Tag='${Name}'`;

				db.query(deleteTag, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}
					return res
						.status(200)
						.send({ success: true, msg: 'Tag deleted succesfully' });
				});
			});
		});
	} else {
		return sendResponse(400, 'You need to be loged in to access that', res);
	}
};

exports.assignTagToUser = async (req, res) => {
	const Token = req.headers.token;
	const { TagId } = req.body;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			const data = jwt.verify(Token, process.env.JWT_SECRET);

			const UserId = data.uid;

			// Check if tag is already assigned to user

			const checkTag = `SELECT * FROM UserTags WHERE TagId=${TagId} AND UserId='${UserId}'`;

			db.query(checkTag, (err, result) => {
				if (!UserId.trim()) {
					return sendResponse(400, 'User id is missing', res);
				} else if (!TagId.trim()) {
					return sendResponse(400, 'Tag id is missing', res);
				} else if (err) {
					return sendResponse(400, err, res);
				} else if (result.length > 0) {
					return sendResponse(400, 'Tag already assigned to user', res);
				} else {
					const insertTag = `INSERT INTO UserTags (UserId, TagId) VALUES ('${UserId}', '${TagId}')`;

					db.query(insertTag, (err, result) => {
						if (err) {
							return sendResponse(400, err, res);
						}
						return res
							.status(200)
							.send({ success: true, msg: 'Tag assigned to user succesfully' });
					});
				}
			});
		});
	} else {
		return sendResponse(400, 'You need to be loged in to access that', res);
	}
};

exports.viewAllTags = async (req, res) => {
	const Token = req.headers.token;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}
			const selectTags = `SELECT * FROM Tags`;

			db.query(selectTags, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				if (!result) {
					return sendResponse(400, 'No tags, please create some.', res);
				}

				return res.status(200).send({ success: true, data: result });
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};

exports.viewUserTags = async (req, res) => {
	const Token = req.headers.token;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			const data = jwt.verify(Token, process.env.JWT_SECRET);

			const UserId = data.uid;

			const selectTags = `SELECT Tag FROM Tags WHERE Id IN (SELECT TagId FROM UserTags WHERE UserId='${UserId}')`;

			db.query(selectTags, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}
				console.log(result);

				return res.status(200).send({ success: true, data: result });
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};
