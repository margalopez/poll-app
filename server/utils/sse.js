/**
 * SSE (Server-Sent Events) utility for managing live vote updates.
 * This module maintains a registry of active SSE clients for each poll and provides
 * functions to add/remove clients and broadcast updates to them.
 */

const clients = new Map();

/**
 * Adds a client to the registry for a specific poll.
 * @param {number} pollId - The ID of the poll.
 * @param {Response} res - The SSE response object.
 */
function addClient(pollId, res) {
	if (!clients.has(pollId)) clients.set(pollId, new Set());
	clients.get(pollId).add(res);
}

/**
 * Removes a client from the registry for a specific poll.
 * @param {number} pollId - The ID of the poll.
 * @param {Response} res - The SSE response object.
 */
function removeClient(pollId, res) {
	const poll = clients.get(pollId);
	if (!poll) return;
	poll.delete(res);
	if (poll.size === 0) clients.delete(pollId);
}

/**
 * Broadcasts updated vote counts to all clients watching a specific poll.
 * @param {number} pollId - The ID of the poll.
 * @param {Array} options - The updated options array.
 */
function broadcast(pollId, options) {
	const poll = clients.get(pollId);
	if (!poll) return;
	const payload = `data: ${JSON.stringify(options)}\n\n`;
	for (const res of poll) {
		res.write(payload);
	}
}

module.exports = { addClient, removeClient, broadcast };
