const express = require('express');
const router = express.Router();
const { StudyTracker } = require('../../database/database');
router.post('/', async (req, res) => {
	const { day, hours } = req.body;

	const toUpdate = {};
	const dayOfWeek = day.toLowerCase();
	toUpdate[dayOfWeek] = hours;

	await StudyTracker.update(toUpdate, {
		where: {
			userId: req.session.user,
		},
	});

	res.sendStatus(200);
});

module.exports = router;
