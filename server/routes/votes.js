const express = require('express');
const db = require('../core/db');
const { broadcast } = require('../utils/sse');

const router = express.Router();

/**
 * Casts a vote for an option.
 * @param {Object} req.body - The request body containing the option ID.
 * @param {string} req.body.optionId - The ID of the option to vote for.
 * @returns {Object} The updated options for the poll.
 */
router.post('/', (req, res) => {
	const { optionId } = req.body;

	if (!optionId) {
		return res.status(400).json({ error: 'optionId is required.' });
	}

	const option = db.prepare('SELECT * FROM options WHERE id = ?').get(optionId);
	if (!option) {
		return res.status(404).json({ error: 'Option not found.' });
	}

	db.prepare('UPDATE options SET votes = votes + 1 WHERE id = ?').run(optionId);

	// Fetch updated options so we can return them and broadcast to SSE clients
	const options = db.prepare('SELECT * FROM options WHERE poll_id = ?').all(option.poll_id);

	// Push live update to every browser watching this poll
	broadcast(option.poll_id, options);

	res.json({ options });
});

module.exports = router;
