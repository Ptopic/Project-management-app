const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sendResponse } = require('../utils/helper');

// --- Projects ---

exports.createProject = async (req, res) => {
	const Token = req.headers.token;
	const { Name, Description, Icon } = req.body;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			// Check if project already exists

			const findProjectByName = `SELECT * FROM Projects WHERE Name='${Name}'`;

			if (!Name.trim() || !Description.trim() || !Icon.trim()) {
				return sendResponse(400, 'Some project data is missing', res);
			}
			db.query(findProjectByName, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				if (result.length > 0) {
					return sendResponse(
						400,
						'Project with that name already exists',
						res
					);
				}

				const insertPost = `INSERT INTO Projects (Name, Description, Icon) VALUES ('${Name}', '${Description}', '${Icon}')`;

				db.query(insertPost, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}

					return res
						.status(200)
						.send({ success: true, msg: 'Project create succesfully' });
				});
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};

exports.viewProjectInfo = async (req, res) => {
	const Token = req.headers.token;
	const { ProjectId } = req.body;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			// Check if project already exists

			const findProject = `SELECT * FROM Projects WHERE ProjectId='${ProjectId}'`;

			if (!ProjectId.trim()) {
				return sendResponse(400, 'Some project data is missing', res);
			}
			db.query(findProject, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				if (result.length <= 0) {
					return sendResponse(400, 'No Projects found', res);
				}

				return res.status(200).send({ success: true, data: result });
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};

exports.searchProject = async (req, res) => {
	const Token = req.headers.token;
	const { Query } = req.body;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			// Search for project by query
			const findProject = `SELECT * FROM Projects WHERE name LIKE '%${Query}%'`;

			if (!Query) {
				return sendResponse(400, 'Search query is missing', res);
			}

			db.query(findProject, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				if (result.length <= 0) {
					return sendResponse(400, 'No Projects found', res);
				}

				return res.status(200).send({ success: true, data: result });
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};

exports.joinProject = async (req, res) => {
	const Token = req.headers.token;
	const { ProjectId } = req.body;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}
			if (!ProjectId) {
				return sendResponse(400, 'User id or project id is missing', res);
			}

			const data = jwt.verify(Token, process.env.JWT_SECRET);

			const UserId = data.uid;

			// Check if project exists

			const checkIfProjectExists = `SELECT * FROM Projects WHERE ProjectId='${ProjectId}'`;

			db.query(checkIfProjectExists, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				if (result.length <= 0) {
					return sendResponse(400, 'Project doesnt exist', res);
				}

				// Check if user is already joined that project

				const checkIfJoined = `SELECT * FROM UsersProjects WHERE UserId='${UserId}' AND ProjectId='${ProjectId}'`;

				db.query(checkIfJoined, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}

					if (result.length > 0) {
						return sendResponse(400, 'User already joined that project', res);
					}

					const joinProject = `INSERT INTO UsersProjects (UserId, ProjectId) VALUES('${UserId}', '${ProjectId}')`;

					db.query(joinProject, (err, result) => {
						if (err) {
							return sendResponse(400, err, res);
						}

						return res
							.status(200)
							.send({ success: true, msg: 'Project joined succesfully' });
					});
				});
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};

exports.leaveProject = async (req, res) => {
	const Token = req.headers.token;
	const { ProjectId } = req.body;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}
			if (!ProjectId) {
				return sendResponse(400, 'User id or project id is missing', res);
			}

			const data = jwt.verify(Token, process.env.JWT_SECRET);

			const UserId = data.uid;

			// Check if user is assigned to that project

			const checkIsAssigned = `SELECT * FROM UsersProjects WHERE UserId='${UserId}' AND ProjectId='${ProjectId}'`;

			db.query(checkIsAssigned, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				if (result.length <= 0) {
					return sendResponse(
						400,
						'User not assigned to that project or project doesnt exist.',
						res
					);
				}

				const leaveProject = `DELETE FROM UsersProjects WHERE UserId='${UserId}' AND ProjectId='${ProjectId}'`;

				db.query(leaveProject, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}

					return res
						.status(200)
						.send({ success: true, msg: 'Project removed succesfully' });
				});
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};

exports.viewMyProjects = async (req, res) => {
	const Token = req.headers.token;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			const data = jwt.verify(Token, process.env.JWT_SECRET);

			const UserId = data.uid;

			const selectMyProjects = `SELECT * FROM Projects WHERE ProjectId IN (SELECT ProjectId FROM UsersProjects WHERE UserId='${UserId}')`;

			db.query(selectMyProjects, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				if (result.length <= 0) {
					return sendResponse(400, 'No Projects found', res);
				}

				return res.status(200).send({ success: true, data: result });
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};

exports.favorite = async (req, res) => {
	const Token = req.headers.token;

	const { ProjectId } = req.body;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			if (!ProjectId) {
				return sendResponse(400, 'Project id missing', res);
			}

			const data = jwt.verify(Token, process.env.JWT_SECRET);

			const UserId = data.uid;

			// Check if project exists

			const doesProjectExist = `SELECT * FROM Projects WHERE ProjectId='${ProjectId}'`;

			db.query(doesProjectExist, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				if (result.length <= 0) {
					return sendResponse(400, 'Project doesnt exist', res);
				}
				// Check if project is joined by user

				const isJoinedByUser = `SELECT * FROM UsersProjects WHERE ProjectId='${ProjectId}' AND UserId='${UserId}'`;

				db.query(isJoinedByUser, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}
					console.log(result);
					if (result.length <= 0) {
						return sendResponse(
							400,
							'You have to join that project to favorite it',
							res
						);
					}

					// Check if project is already favorited

					const isAlreadyFavorited = `SELECT * FROM Favorites WHERE UserId='${UserId}' AND ProjectId='${ProjectId}'`;

					db.query(isAlreadyFavorited, (err, result) => {
						if (err) {
							return sendResponse(400, err, res);
						}
						if (result.length > 0) {
							return sendResponse(400, 'Project already in favorites', res);
						}

						const insertFavorite = `INSERT INTO Favorites (UserID, ProjectId) VALUES('${UserId}','${ProjectId}')`;

						db.query(insertFavorite, (err, result) => {
							if (err) {
								return sendResponse(400, err, res);
							}

							return res
								.status(200)
								.send({ sucess: true, msg: 'Added to favorites' });
						});
					});
				});
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};

exports.unfavorite = async (req, res) => {
	const Token = req.headers.token;

	const { ProjectId } = req.body;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			if (!ProjectId) {
				return sendResponse(400, 'Project id missing', res);
			}

			const data = jwt.verify(Token, process.env.JWT_SECRET);

			const UserId = data.uid;

			// Check if project exists

			const doesProjectExist = `SELECT * FROM Projects WHERE ProjectId='${ProjectId}'`;

			db.query(doesProjectExist, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				if (result.length <= 0) {
					return sendResponse(400, 'Project doesnt exist', res);
				}
				// Check if project is joined by user

				const isJoinedByUser = `SELECT * FROM UsersProjects WHERE ProjectId='${ProjectId}' AND UserId='${UserId}'`;

				db.query(isJoinedByUser, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}
					console.log(result);
					if (result.length <= 0) {
						return sendResponse(
							400,
							'You have to join that project to favorite it',
							res
						);
					}

					// Check if project is already favorited

					const isAlreadyFavorited = `SELECT * FROM Favorites WHERE UserId='${UserId}' AND ProjectId='${ProjectId}'`;

					db.query(isAlreadyFavorited, (err, result) => {
						if (err) {
							return sendResponse(400, err, res);
						}
						if (result.length <= 0) {
							return sendResponse(400, 'Project is not in favorites', res);
						}

						const deleteFavorite = `DELETE FROM Favorites WHERE UserId='${UserId}' AND ProjectId='${ProjectId}'`;

						db.query(deleteFavorite, (err, result) => {
							if (err) {
								return sendResponse(400, err, res);
							}

							return res
								.status(200)
								.send({ sucess: true, msg: 'Removed from favorites' });
						});
					});
				});
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};

exports.viewFavorites = async (req, res) => {
	const Token = req.headers.token;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			const data = jwt.verify(Token, process.env.JWT_SECRET);

			const UserId = data.uid;

			const selectFavortiesOfUser = `SELECT * FROM Projects WHERE ProjectId IN (SELECT ProjectId FROM Favorites WHERE UserId='${UserId}')`;

			db.query(selectFavortiesOfUser, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				if (result.length <= 0) {
					return sendResponse(400, 'No favorites...', res);
				}

				return res.status(200).send({
					success: true,
					data: result,
				});
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};

// --- Projects tasks ---

exports.createTaskCategory = async (req, res) => {
	const Token = req.headers.token;
	const { Category } = req.body;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			if (!Category) {
				return sendResponse(400, 'Category name missing', res);
			}

			// Check if task category already exists

			const checkIfExists = `SELECT * FROM TasksCategories WHERE Category='${Category}'`;

			db.query(checkIfExists, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				if (result.length > 0) {
					return sendResponse(400, 'Tash category already exists', res);
				}

				const insertCategory = `INSERT INTO TasksCategories (Category) VALUES ('${Category}')`;

				db.query(insertCategory, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}

					return res.status(200).send({
						success: true,
						msg: 'Project task category created succesfully',
					});
				});
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};

exports.viewAllTaskCategories = async (req, res) => {
	const Token = req.headers.token;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			const selectCategories = `SELECT * FROM TasksCategories`;

			db.query(selectCategories, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				return res.status(200).send({
					success: true,
					data: result,
				});
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};

exports.createTask = async (req, res) => {
	const Token = req.headers.token;
	const { Name, Description, Category } = req.body;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			if (!Name || !Description || !Category) {
				return sendResponse(400, 'Task data missing', res);
			}

			const insertTask = `INSERT INTO Tasks (Name, Description, Category) VALUES ('${Name}', '${Description}', '${Category}')`;

			db.query(insertTask, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				return res.status(200).send({
					success: true,
					msg: 'Project task created succesfully',
				});
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};

exports.editTask = async (req, res) => {
	const Token = req.headers.token;
	const { Name, Description, Category } = req.body;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			if (!Name || !Description || !Category) {
				return sendResponse(400, 'Task data missing', res);
			}

			// Check if project task exists
			const exists = ``
			const insertTask = `INSERT INTO Tasks (Name, Description, Category) VALUES ('${Name}', '${Description}', '${Category}')`;

			db.query(insertTask, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				return res.status(200).send({
					success: true,
					msg: 'Project task created succesfully',
				});
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};

exports.assignTaskToProject = async (req, res) => {
	const Token = req.headers.token;
	const { ProjectId, TaskId } = req.body;

	if (Token) {
		jwt.verify(Token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			if (!ProjectId || !TaskId) {
				return sendResponse(400, 'Project id or Task id missing', res);
			}

			// Check if project exists

			const checkIfExists = `SELECT * FROM Projects WHERE ProjectId='${ProjectId}'`;

			db.query(checkIfExists, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}

				if (result.length <= 0) {
					return sendResponse(400, 'Project doesnt exist', res);
				}

				// Check if task exists

				const checkIfTaskExists = `SELECT * FROM Tasks WHERE Id='${TaskId}'`;

				db.query(checkIfTaskExists, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}

					if (result.length <= 0) {
						return sendResponse(400, 'Task doesnt exist', res);
					}

					const data = jwt.verify(Token, process.env.JWT_SECRET);

					const UserId = data.uid;

					const assignTaskToProject = `INSERT INTO ProjectTasks (UserId, ProjectId, TaskId) VALUES ('${UserId}','${ProjectId}','${TaskId}')`;

					db.query(assignTaskToProject, (err, result) => {
						if (err) {
							return sendResponse(400, err, res);
						}
					});

					return res.status(200).send({
						success: true,
						msg: 'Task assigned to project succesfully',
					});
				});
			});
		});
	} else {
		return sendResponse(400, 'You need to be logedin to access that', res);
	}
};
