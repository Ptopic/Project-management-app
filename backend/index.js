const epxress = require('express');
const app = epxress();
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const port = 3001;

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests
	standardHeaders: true,
	legacyHeaders: false,
});

require('dotenv').config();

/*
Swagger ui options
*/

const options = {
	info: {
		version: '1.0.0',
		title: 'Project managment App',
		description: 'Api for project managments app.',
		license: {
			name: 'MIT',
		},
	},
	filesPattern: './*.js',
	baseDir: './routes',
};

expressJSDocSwagger(app)(options);

// Main router import

const usersRouter = require('./routes/users');
const projectsRouter = require('./routes/projects');
const tagsRouter = require('./routes/tags');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(epxress.json());
app.use(cors());

// Rate limiter usage
app.use(limiter);

// Using main router
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/users', tagsRouter);
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
