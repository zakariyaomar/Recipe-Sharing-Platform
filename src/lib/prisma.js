const { PrismaClient } = require('@prisma/client');

// Single shared client so the whole app reuses one connection pool.
const prisma = new PrismaClient();

module.exports = prisma;
