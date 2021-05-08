require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const path = require('path');
const exphbs = require('express-handlebars');
const options = require('./utils/options');
const {
	Post,
	ChatPost,
	ChatComment,
	StudyTracker,
} = require('./database/database');
const resources = require('./routes/api/resources');
const auth = require('./routes/api/auth');
const chatroom = require('./routes/api/chatroom');
const tracker = require('./routes/api/tracker');

const USER_SESSION = 'user.session';
const IS_PROD = process.env.NODE_ENV === 'production';
console.log('Running in production mode: ', IS_PROD);

const sessionStore = new MySQLStore(options);

const app = express()
	.set('trust proxy', 1)
	.use(
		cors({
			credentials: true,
		})
	)
	.use(express.json({ limit: 50000000 }))
	.use(
		session({
			secret: process.env.SESSION_SECRET || 'ECOMMERCE',
			name: USER_SESSION,
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				signed: true,
				maxAge: 1000 * 60 * 60 * 24 * 3,
				secure: IS_PROD ? true : false,
				sameSite: IS_PROD ? 'none' : 'lax',
			},
			store: sessionStore,
		})
	);

app.set('views', './public');
app.set('view engine', 'handlebars');
app.engine(
	'handlebars',
	exphbs({ layoutsDir: 'public', partialsDir: 'public' })
);

const protectedRoutes = ['/dashboard', '/chatroom', '/resources', '/tracker'];
const authRoutes = ['/login', '/signup', '/'];
const defaultRoute = '/dashboard';
const requireAuth = (req, res, next) => {
	if (req.session.user && authRoutes.includes(req.path)) {
		res.redirect(defaultRoute);
	} else if (!req.session.user && protectedRoutes.includes(req.path)) {
		res.redirect('/');
	} else {
		next();
	}
};

app.use(requireAuth);

app.use(
	express.static(path.join(__dirname, '/public'), {
		index: 'index.html',
		extensions: ['html'],
	})
);

app.use('/api/post', resources);
app.use('/api', auth);
app.use('/api/chat', chatroom);
app.use('/api/tracker', tracker);

const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 3001;

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

app.get('/resources', async (req, res) => {
	const posts = (await Post.findAll())
		.map(curr => ({
			...curr.dataValues,
			owned: curr.dataValues.createdBy === req.session.user,
		}))
		.reverse();
	res.render('resources', {
		layout: false,
		username: req.session.user,
		posts,
	});
});

app.get('/chatroom', async (req, res) => {
	const posts = await Promise.all(
		(await ChatPost.findAll())
			.map(curr => curr.dataValues)
			.map(async post => {
				const comments = (
					await ChatComment.findAll({
						where: {
							postId: post.id,
						},
					})
				).map(curr => curr.dataValues);
				return {
					...post,
					comments: comments,
				};
			})
	);
	res.render('chatroom', {
		layout: false,
		username: req.session.user,
		posts: posts.reverse(),
	});
});

app.get('/trainer', async (req, res) => {
	res.render('trainer', {
		layout: false,
		username: req.session.user,
	});
});

app.get('/dashboard', async (req, res) => {
	res.render('dashboard', {
		layout: false,
		username: req.session.user,
	});
});

app.get('/tracker', async (req, res) => {
	const week = (
		await StudyTracker.findOrCreate({
			where: { userId: req.session.user },
			defaults: {
				monday: 0,
				tuesday: 0,
				wednesday: 0,
				tuesday: 0,
				friday: 0,
				saturday: 0,
				sunday: 0,
				userId: req.session.user,
			},
		})
	).map(x => x.dataValues);
	res.render('tracker', {
		layout: false,
		username: req.session.user,
		week: week[0],
	});
});

app.get('/*', (req, res) => {
	res.redirect('/');
});
