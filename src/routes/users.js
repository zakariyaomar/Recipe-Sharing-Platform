const express = require('express');
const prisma = require('../lib/prisma');
const { toId, handleError } = require('../lib/http');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { name, email, bio } = req.body || {};
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }
    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email is required' });
    }
    if (bio !== undefined && bio !== null && typeof bio !== 'string') {
      return res.status(400).json({ error: 'bio must be a string' });
    }
    const user = await prisma.user.create({
      data: { name: name.trim(), email: email.trim().toLowerCase(), bio },
    });
    res.status(201).json(user);
  } catch (err) {
    handleError(res, err);
  }
});

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' },
      include: { _count: { select: { recipes: true } } },
    });
    res.json(users);
  } catch (err) {
    handleError(res, err);
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid user id' });
    const user = await prisma.user.findUnique({
      where: { id },
      include: { recipes: { orderBy: { id: 'asc' } } },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
});

// POST /api/users/:id/favorites  { recipeId }
router.post('/:id/favorites', async (req, res) => {
  try {
    const userId = toId(req.params.id);
    const recipeId = toId((req.body || {}).recipeId);
    if (!userId) return res.status(400).json({ error: 'Invalid user id' });
    if (!recipeId) return res.status(400).json({ error: 'recipeId must be a positive integer' });

    const [user, recipe] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.recipe.findUnique({ where: { id: recipeId } }),
    ]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    const favorite = await prisma.favorite.create({ data: { userId, recipeId } });
    res.status(201).json(favorite);
  } catch (err) {
    handleError(res, err);
  }
});

// GET /api/users/:id/favorites
router.get('/:id/favorites', async (req, res) => {
  try {
    const userId = toId(req.params.id);
    if (!userId) return res.status(400).json({ error: 'Invalid user id' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { recipe: true },
    });
    res.json(favorites.map((f) => f.recipe));
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE /api/users/:id/favorites/:recipeId
router.delete('/:id/favorites/:recipeId', async (req, res) => {
  try {
    const userId = toId(req.params.id);
    const recipeId = toId(req.params.recipeId);
    if (!userId || !recipeId) return res.status(400).json({ error: 'Invalid id' });

    const result = await prisma.favorite.deleteMany({ where: { userId, recipeId } });
    if (result.count === 0) return res.status(404).json({ error: 'Favorite not found' });
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
