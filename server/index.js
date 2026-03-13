const express = require('express');
const cors = require('cors');

// Importing db triggers schema creation and seeding on first run
require('./core/db');

const pollsRouter = require('./routes/polls');
const votesRouter = require('./routes/votes');
const eventsRouter = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/poll', pollsRouter);
app.use('/api/vote', votesRouter);
app.use('/api/events', eventsRouter);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
