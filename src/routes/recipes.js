const express = require('express');
const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');
const { toId, handleError } = require('../lib/http');

const router = express.Router();

const DIFFICULTIES = ['easy', 'medium', 'hard'];

const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== '';
const isNonNegInt = (v) => Number.isInteger(v) && v >= 0;
const isPositiveInt = (v) => Number.isInteger(v) && v > 0;

// Validates recipe fields. With partial=true only the supplied fields are checked
// (used by PUT); otherwise all required fields must be present (used by POST).
// Returns an error message or null.
function validateRecipe(body, partial) {
  const has = (k) => body[k] !== undefined;
  const required = (k) => !partial || has(k);

  if (required('title') && !isNonEmptyString(body.title)) return 'title is required';
  if (required('prepTime') && !isNonNegInt(body.prepTime)) return 'prepTime must be a non-negative integer (minutes)';
  if (required('cookTime') && !isNonNegInt(body.cookTime)) return 'cookTime must be a non-negative integer (minutes)';
  if (required('category') && !isNonEmptyString(body.category)) return 'category is required';
  if (required('authorId') && !isPositiveInt(body.authorId)) return 'authorId must be a positive integer';

  if (has('servings') && !isPositiveInt(body.servings)) return 'servings must be a positive integer';
  if (has('difficulty') && !DIFFICULTIES.includes(body.difficulty)) {
    return `difficulty must be one of: ${DIFFICULTIES.join(', ')}`;
  }
  if (has('description') && body.description !== null && typeof body.description !== 'string') {
    return 'description must be a string';
  }
  if (has('imageUrl') && body.imageUrl !== null && typeof body.imageUrl !== 'string') {
    return 'imageUrl must be a string';
  }

  if (required('ingredients')) {
    const ok =
      Array.isArray(body.ingredients) &&
      body.ingredients.length > 0 &&
      body.ingredients.every(
        (i) =>
          i &&
          isNonEmptyString(i.name) &&
          (typeof i.amount === 'string' || typeof i.amount === 'number') &&
          typeof i.unit === 'string'
      );
    if (!ok) return 'ingredients must be a non-empty array of { name, amount, unit }';
  }
  if (required('steps')) {
    const ok = Array.isArray(body.steps) && body.steps.length > 0 && body.steps.every(isNonEmptyString);
    if (!ok) return 'steps must be a non-empty array of strings';
  }
  return null;
}

const RECIPE_FIELDS = [
  'title', 'description', 'prepTime', 'cookTime', 'servings', 'difficulty',
  'category', 'ingredients', 'steps', 'imageUrl', 'authorId',
];

function pickRecipeData(body) {
  const data = {};
  for (const key of RECIPE_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (typeof data.title === 'string') data.title = data.title.trim();
  if (typeof data.category === 'string') data.category = data.category.trim();
  return data;
}

const authorSelect = { select: { id: true, name: true, email: true, bio: true } };

// POST /api/recipes
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const error = validateRecipe(body, false);
    if (error) return res.status(400).json({ error });

    const author = await prisma.user.findUnique({ where: { id: body.authorId } });
    if (!author) return res.status(404).json({ error: 'Author not found' });

    const recipe = await prisma.recipe.create({
      data: pickRecipeData(body),
      include: { author: authorSelect },
    });
    res.status(201).json(recipe);
  } catch (err) {
    handleError(res, err);
  }
});

// GET /api/recipes?category=&search=&difficulty=&maxCookTime=&ingredient=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const { category, search, difficulty, maxCookTime, ingredient } = req.query;

    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);
    if (!Number.isInteger(page) || page < 1) page = 1;
    if (!Number.isInteger(limit) || limit < 1) limit = 10;
    limit = Math.min(limit, 100);

    // Build the where clause dynamically from whichever filters were supplied.
    const where = {};
    if (category) where.category = { equals: String(category), mode: 'insensitive' };
    if (search) where.title = { contains: String(search), mode: 'insensitive' };
    if (difficulty) where.difficulty = String(difficulty).toLowerCase();
    if (maxCookTime !== undefined) {
      const max = parseInt(maxCookTime, 10);
      if (!Number.isInteger(max) || max < 0) {
        return res.status(400).json({ error: 'maxCookTime must be a non-negative integer' });
      }
      where.cookTime = { lte: max };
    }

    // Ingredients live in a JSON column, so match on ingredient names with a raw query.
    if (ingredient) {
      const escaped = String(ingredient).replace(/[\\%_]/g, '\\$&');
      const rows = await prisma.$queryRaw(Prisma.sql`
        SELECT r.id FROM "Recipe" r
        WHERE EXISTS (
          SELECT 1 FROM jsonb_array_elements(r.ingredients) AS ing
          WHERE ing->>'name' ILIKE ${'%' + escaped + '%'}
        )`);
      where.id = { in: rows.map((r) => r.id) };
    }

    const [total, recipes] = await Promise.all([
      prisma.recipe.count({ where }),
      prisma.recipe.findMany({
        where,
        orderBy: { id: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { author: { select: { id: true, name: true } } },
      }),
    ]);

    res.json({
      recipes,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    handleError(res, err);
  }
});

// GET /api/recipes/:id
router.get('/:id', async (req, res) => {
  try {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid recipe id' });

    const [recipe, ratings] = await Promise.all([
      prisma.recipe.findUnique({ where: { id }, include: { author: authorSelect } }),
      prisma.rating.aggregate({ where: { recipeId: id }, _avg: { value: true }, _count: { value: true } }),
    ]);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    const avg = ratings._avg.value;
    res.json({
      ...recipe,
      averageRating: avg === null ? null : Math.round(avg * 100) / 100,
      ratingCount: ratings._count.value,
    });
  } catch (err) {
    handleError(res, err);
  }
});

// PUT /api/recipes/:id
router.put('/:id', async (req, res) => {
  try {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid recipe id' });

    const body = req.body || {};
    const error = validateRecipe(body, true);
    if (error) return res.status(400).json({ error });

    const data = pickRecipeData(body);
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No updatable fields provided' });
    }

    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Recipe not found' });

    if (data.authorId !== undefined) {
      const author = await prisma.user.findUnique({ where: { id: data.authorId } });
      if (!author) return res.status(404).json({ error: 'Author not found' });
    }

    const recipe = await prisma.recipe.update({
      where: { id },
      data,
      include: { author: authorSelect },
    });
    res.json(recipe);
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE /api/recipes/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid recipe id' });

    await prisma.recipe.delete({ where: { id } }); // P2025 -> 404 via handleError
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    handleError(res, err);
  }
});

// POST /api/recipes/:id/ratings  { userId, value }
router.post('/:id/ratings', async (req, res) => {
  try {
    const recipeId = toId(req.params.id);
    const { userId, value } = req.body || {};
    if (!recipeId) return res.status(400).json({ error: 'Invalid recipe id' });
    if (!isPositiveInt(userId)) return res.status(400).json({ error: 'userId must be a positive integer' });
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return res.status(400).json({ error: 'value must be an integer between 1 and 5' });
    }

    const [user, recipe] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.recipe.findUnique({ where: { id: recipeId } }),
    ]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    // A user has one rating per recipe; rating again updates it.
    const rating = await prisma.rating.upsert({
      where: { userId_recipeId: { userId, recipeId } },
      update: { value },
      create: { userId, recipeId, value },
    });
    res.status(201).json(rating);
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
