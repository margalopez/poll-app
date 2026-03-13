const express = require('express');
const db = require('../core/db');

const router = express.Router();

/**
 * Fetches a poll and its options by ID.
 * @param {string} id - The ID of the poll to fetch.
 * @returns {Object} The poll and its options.
 */
router.get('/:id', (req, res) => {
	const poll = db.prepare('SELECT * FROM polls WHERE id = ?').get(req.params.id);
	if (!poll) return res.status(404).json({ error: 'Poll not found' });

	const options = db.prepare('SELECT * FROM options WHERE poll_id = ?').all(poll.id);
	res.json({ ...poll, options });
});

/**
 * Creates a new poll with the provided question and options.
 * @param {Object} req.body - The request body containing the poll question and options.
 * @param {string} req.body.question - The question for the new poll.
 * @param {Array<string>} req.body.options - The options for the new poll.
 * @returns {Object} The created poll and its options.
 */
router.post('/', (req, res) => {
	const { question, options } = req.body;

	if (!question || !Array.isArray(options) || options.length < 2) {
		return res
			.status(400)
			.json({ error: 'A question and at least 2 options are required.' });
	}

	const insertPoll = db.prepare('INSERT INTO polls (question) VALUES (?)');
	const insertOption = db.prepare('INSERT INTO options (poll_id, label) VALUES (?, ?)');

	const create = db.transaction(() => {
		const { lastInsertRowid: pollId } = insertPoll.run(question);
		options.forEach((label) => insertOption.run(pollId, label));
		return pollId;
	});

	const pollId = create();
	const poll = db.prepare('SELECT * FROM polls WHERE id = ?').get(pollId);
	const opts = db.prepare('SELECT * FROM options WHERE poll_id = ?').all(pollId);

	res.status(201).json({ ...poll, options: opts });
});

module.exports = router;
