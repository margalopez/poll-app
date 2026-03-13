// import
const Database = require('better-sqlite3');

// define
const db = new Database('poll.db');

/**
 * WAL (Write-Ahead Logging) mode.
 * Allows for better concurrent read performance by enabling readers to access
 * the database while a write transaction is in progress.
 */
db.pragma('journal_mode = WAL');

/**
 * Initialize the database schema if it doesn't exist. We have two tables:
 * - polls: stores the poll questions.
 * - options: stores the options for each poll along with their vote counts.
 */
db.exec(`
	CREATE TABLE IF NOT EXISTS polls (
		id INTEGER PRIMARY KEY,
		question TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS options (
		id INTEGER PRIMARY KEY,
		poll_id INTEGER REFERENCES polls(id),
		label TEXT NOT NULL,
		votes INTEGER DEFAULT 0
	);
`);

/**
 * Seed the database with a default poll if it's empty. OK for MVP.
 */
const { count } = db.prepare('SELECT COUNT(*) AS count FROM polls').get();

if (count === 0) {
	const insertPoll = db.prepare('INSERT INTO polls (question) VALUES (?)');
	const insertOption = db.prepare('INSERT INTO options (poll_id, label) VALUES (?, ?)');

	const seed = db.transaction(() => {
		const { lastInsertRowid: pollId } = insertPoll.run(
			'What is your favorite programming language?'
		);
		['JavaScript', 'TypeScript', 'Python', 'Rust'].forEach((label) =>
			insertOption.run(pollId, label)
		);
	});

	seed();
	console.log('Database seeded with a default poll.');
}

module.exports = db;
