require('dotenv').config();
const express = require('express');
const cors = require('cors');

const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');
const metaRouter = require('./routes/meta');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok', name: 'Recipe Sharing Platform API' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/users', usersRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api', metaRouter);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Catches malformed JSON bodies and anything else that slips past route handlers.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
