const express = require('express');
const router = express.Router();
const { ChatPost, ChatComment } = require('../../database/database');
const { v2 } = require('cloudinary');

v2.config({
	cloud_name: process.env.CLOUDINARY_URL_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/', async (req, res) => {
	const { message, image } = req.body;
	let pictureUrl = undefined; // get url from cloudinary
	if (image) {
		try {
			const response = await v2.uploader.upload(image, {
				overwrite: true,
				invalidate: true,
			});

			pictureUrl = response.url;
		} catch (err) {
			console.log(err);
		}
	}

	const post = {
		message,
		image: pictureUrl,
		createdBy: req.session.user,
	};
	const databaseChatPost = ChatPost.build(post);
	await databaseChatPost.save();
	res.sendStatus(200);
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	const post = await ChatPost.findOne({ where: { id } });
	ChatComment.destroy({ where: { postId: id } });
	post.destroy();
	res.sendStatus(200);
});

router.post('/comment/:postId', async (req, res) => {
	const { postId } = req.params;
	const { message } = req.body;
	const comment = {
		message,
		createdBy: req.session.user,
		postId,
	};
	const databaseComment = ChatComment.build(comment);
	await databaseComment.save();
	res.sendStatus(200);
});

module.exports = router;
