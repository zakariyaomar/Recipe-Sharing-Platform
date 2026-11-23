// Parses a value as a positive integer; returns null if invalid.
function toId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Maps known Prisma errors to HTTP responses; falls back to 500.
function handleError(res, err) {
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'A record with that unique value already exists' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }
  if (err.code === 'P2003') {
    return res.status(400).json({ error: 'Referenced record does not exist' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = { toId, handleError };
