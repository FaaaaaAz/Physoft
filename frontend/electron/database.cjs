const { PrismaClient } = require('@prisma/client');
const path = require('path');
const { app } = require('electron');

// Initialize Prisma Client
let prisma;

function initDatabase() {
  if (!prisma) {
    // In production, the DB will be in the user directory
    const dbPath = app.isPackaged
      ? path.join(app.getPath('userData'), 'physoft.db')
      : path.join(__dirname, '..', 'prisma', 'physoft.db');

    process.env.DATABASE_URL = `file:${dbPath}`;

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });

    console.log('✅ SQLite database initialized:', dbPath);
  }
  return prisma;
}

// ============================================
// Athletes API
// ============================================

async function createAthlete(data) {
  const db = initDatabase();
  try {
    const athlete = await db.atleta.create({
      data: {
        ...data,
        deviceId: require('os').hostname() // Device ID
      }
    });
    console.log('✅ Athlete created:', athlete.nombre);
    return { success: true, data: athlete };
  } catch (error) {
    console.error('❌ Error creating athlete:', error);
    return { success: false, error: error.message };
  }
}

async function getAthletes() {
  const db = initDatabase();
  try {
    const athletes = await db.atleta.findMany({
      where: {
        deletedAt: null // Only non-deleted athletes
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return { success: true, data: athletes };
  } catch (error) {
    console.error('❌ Error fetching athletes:', error);
    return { success: false, error: error.message };
  }
}

async function getAthleteById(id) {
  const db = initDatabase();
  try {
    const athlete = await db.atleta.findUnique({
      where: { id },
      include: {
        analisis: true
      }
    });
    return { success: true, data: athlete };
  } catch (error) {
    console.error('❌ Error fetching athlete:', error);
    return { success: false, error: error.message };
  }
}

async function updateAthlete(id, data) {
  const db = initDatabase();
  try {
    const athlete = await db.atleta.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
    console.log('✅ Athlete updated:', athlete.nombre);
    return { success: true, data: athlete };
  } catch (error) {
    console.error('❌ Error updating athlete:', error);
    return { success: false, error: error.message };
  }
}

async function deleteAthlete(id) {
  const db = initDatabase();
  try {
    // Soft delete
    const athlete = await db.atleta.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
    console.log('✅ Athlete deleted (soft):', athlete.nombre);
    return { success: true, data: athlete };
  } catch (error) {
    console.error('❌ Error deleting athlete:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// Analysis API
// ============================================

async function createAnalysis(data) {
  const db = initDatabase();
  try {
    const analysis = await db.analisis.create({
      data: {
        ...data,
        deviceId: require('os').hostname()
      }
    });
    console.log('✅ Analysis created for athlete:', data.atletaId);
    return { success: true, data: analysis };
  } catch (error) {
    console.error('❌ Error creating analysis:', error);
    return { success: false, error: error.message };
  }
}

async function getAnalysisByAthlete(athleteId) {
  const db = initDatabase();
  try {
    const analyses = await db.analisis.findMany({
      where: {
        atletaId: athleteId,
        deletedAt: null
      },
      orderBy: {
        fechaAnalisis: 'desc'
      }
    });
    return { success: true, data: analyses };
  } catch (error) {
    console.error('❌ Error fetching analyses:', error);
    return { success: false, error: error.message };
  }
}

// Close connection when closing the app
function closeDatabase() {
  if (prisma) {
    prisma.$disconnect();
    console.log('✅ Database closed');
  }
}

module.exports = {
  initDatabase,
  createAthlete,
  getAthletes,
  getAthleteById,
  updateAthlete,
  deleteAthlete,
  createAnalysis,
  getAnalysisByAthlete,
  closeDatabase
};
