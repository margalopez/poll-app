const express = require('express');
const db = require('../core/db');
const { addClient, removeClient } = require('../utils/sse');

const router = express.Router();

/**
 * Opens an SSE stream for live vote updates for a specific poll.
 * @param {string} pollId - The ID of the poll to subscribe to.
 * @returns {EventStream} An SSE stream that sends updated vote counts whenever they change.
 */
router.get('/:pollId', (req, res) => {
	const pollId = Number(req.params.pollId);

	const poll = db.prepare('SELECT id FROM polls WHERE id = ?').get(pollId);
	if (!poll) return res.status(404).json({ error: 'Poll not found' });

	// Required SSE headers
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.flushHeaders(); // flush immediately so the browser knows the stream has started

	// Send current vote counts as the initial event
	const options = db.prepare('SELECT * FROM options WHERE poll_id = ?').all(pollId);
	res.write(`data: ${JSON.stringify(options)}\n\n`);

	// Register this response so broadcast() can reach it
	addClient(pollId, res);

	// Remove client when the browser closes the connection
	req.on('close', () => removeClient(pollId, res));
});

module.exports = router;
