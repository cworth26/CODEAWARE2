const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Post } = require('../../database/database');
const getFavicons = require('get-website-favicon');

router.post('/', async (req, res) => {
	const { link, description } = req.body;
	console.log('entered');
	if (
		(link.includes('http://') || link.includes('https://')) &&
		description
	) {
		const replacer = link
			.replace('https://', '')
			.replace('http://', '')
			.replace('www.', '');
		const grabLink = replacer.slice(0, replacer.indexOf('/'));
		const response = await getFavicons(grabLink);
		const svgFav = response.icons.filter(curr => curr.src.includes('svg'));
		let favicon =
			svgFav.length > 0
				? svgFav[0].src
				: response.icons.length > 0
				? response.icons[response.icons.length - 1].src
				: null;
		console.log('icon', response);
		if (!favicon) {
			favicon = './images/not-found.png';
		}
		const createdBy = req.session.user;
		const post = {
			link,
			description,
			icon: favicon,
			createdBy,
		};
		const databasePost = Post.build(post);
		await databasePost.save();
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
});

router.get('/', async (req, res) => {
	try {
		const posts = (await Post.findAll()).map(curr => curr.dataValues);
		res.send(posts);
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	const databasePost = await Post.findOne({ where: { id } });
	databasePost.destroy();
	res.sendStatus(200);
});

module.exports = router;
