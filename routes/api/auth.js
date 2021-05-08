const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const { User } = require('../../database/database');

const findUser = async username => {
	const response = await User.findOne({ where: { username } });

	if (response) {
		return response.dataValues;
	}
	return null;
};

router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	console.log(username, password);
	const user = await findUser(username);
	console.log(user);
	if (!user) {
		res.status(400).send({ error: 'Username or password not found' });
	} else {
		try {
			if (await argon2.verify(user.password, password)) {
				const { username } = user;

				req.session.user = username;
				res.redirect('/dashboard');
			} else {
				res.status(400).send({
					error: 'Username or password not found',
				});
			}
		} catch (err) {
			res.sendStatus(500);
		}
	}
});

router.post('/signup', async (req, res) => {
	const { username, password } = req.body;
	if (username.length <= 4) {
		res.status(400).send({ error: 'Username is too short' });
	} else if (password.length <= 4) {
		res.status(400).send({ error: 'Password is too short' });
	}
	const user = await findUser(username);
	if (user) {
		res.status(409).send({ error: 'Account already registered' });
	} else {
		try {
			const hash = await argon2.hash(password);
			const user = {
				username,
				password: hash,
				profilePicture:
					'https://pbs.twimg.com/profile_images/1379353354866995202/apI6V404_normal.jpg',
			};
			const databaseUser = User.build(user);
			await databaseUser.save();

			req.session.user = user.username;
			res.redirect('/dashboard');
		} catch (err) {
			res.status(400).send({ error: 'Please try again Later' });
		}
	}
});

router.post('/logout', (req, res) => {
	req.session.destroy(err => {
		res.clearCookie(USER_SESSION, { path: '/' }).sendStatus(200);
	});
});

module.exports = router;
