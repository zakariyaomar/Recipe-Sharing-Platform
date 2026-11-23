const express = require('express');
const prisma = require('../lib/prisma');
const { handleError } = require('../lib/http');

const router = express.Router();

// GET /api/categories
router.get('/categories', async (req, res) => {
  try {
    const groups = await prisma.recipe.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { category: 'asc' },
    });
    res.json(groups.map((g) => ({ category: g.category, count: g._count.id })));
  } catch (err) {
    handleError(res, err);
  }
});

// GET /api/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalRecipes, totalUsers, groups, agg, easiest, hardest] = await Promise.all([
      prisma.recipe.count(),
      prisma.user.count(),
      prisma.recipe.groupBy({ by: ['category'], _count: { id: true } }),
      prisma.recipe.aggregate({ _avg: { cookTime: true } }),
      prisma.recipe.findFirst({
        orderBy: [{ cookTime: 'asc' }, { id: 'asc' }],
        select: { title: true, cookTime: true },
      }),
      prisma.recipe.findFirst({
        orderBy: [{ cookTime: 'desc' }, { id: 'asc' }],
        select: { title: true, cookTime: true },
      }),
    ]);

    res.json({
      totalRecipes,
      totalUsers,
      recipesByCategory: Object.fromEntries(groups.map((g) => [g.category, g._count.id])),
      avgCookTime: agg._avg.cookTime === null ? 0 : Math.round(agg._avg.cookTime),
      easiestRecipe: easiest,
      hardestRecipe: hardest,
    });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
