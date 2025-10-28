const { PrismaClient } = require('@prisma/client');
const path = require('path');
const { app } = require('electron');

// Inicializar Prisma Client
let prisma;

function initDatabase() {
  if (!prisma) {
    // En producción, la DB estará en el directorio de usuario
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
    
    console.log('✅ Base de datos SQLite inicializada:', dbPath);
  }
  return prisma;
}

// ============================================
// API de Atletas
// ============================================

async function crearAtleta(data) {
  const db = initDatabase();
  try {
    const atleta = await db.atleta.create({
      data: {
        ...data,
        deviceId: require('os').hostname() // ID del dispositivo
      }
    });
    console.log('✅ Atleta creado:', atleta.nombre);
    return { success: true, data: atleta };
  } catch (error) {
    console.error('❌ Error al crear atleta:', error);
    return { success: false, error: error.message };
  }
}

async function obtenerAtletas() {
  const db = initDatabase();
  try {
    const atletas = await db.atleta.findMany({
      where: {
        deletedAt: null // Solo atletas no eliminados
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return { success: true, data: atletas };
  } catch (error) {
    console.error('❌ Error al obtener atletas:', error);
    return { success: false, error: error.message };
  }
}

async function obtenerAtletaPorId(id) {
  const db = initDatabase();
  try {
    const atleta = await db.atleta.findUnique({
      where: { id },
      include: {
        analisis: true
      }
    });
    return { success: true, data: atleta };
  } catch (error) {
    console.error('❌ Error al obtener atleta:', error);
    return { success: false, error: error.message };
  }
}

async function actualizarAtleta(id, data) {
  const db = initDatabase();
  try {
    const atleta = await db.atleta.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
    console.log('✅ Atleta actualizado:', atleta.nombre);
    return { success: true, data: atleta };
  } catch (error) {
    console.error('❌ Error al actualizar atleta:', error);
    return { success: false, error: error.message };
  }
}

async function eliminarAtleta(id) {
  const db = initDatabase();
  try {
    // Soft delete
    const atleta = await db.atleta.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
    console.log('✅ Atleta eliminado (soft):', atleta.nombre);
    return { success: true, data: atleta };
  } catch (error) {
    console.error('❌ Error al eliminar atleta:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// API de Análisis
// ============================================

async function crearAnalisis(data) {
  const db = initDatabase();
  try {
    const analisis = await db.analisis.create({
      data: {
        ...data,
        deviceId: require('os').hostname()
      }
    });
    console.log('✅ Análisis creado para atleta:', data.atletaId);
    return { success: true, data: analisis };
  } catch (error) {
    console.error('❌ Error al crear análisis:', error);
    return { success: false, error: error.message };
  }
}

async function obtenerAnalisisPorAtleta(atletaId) {
  const db = initDatabase();
  try {
    const analisis = await db.analisis.findMany({
      where: {
        atletaId,
        deletedAt: null
      },
      orderBy: {
        fechaAnalisis: 'desc'
      }
    });
    return { success: true, data: analisis };
  } catch (error) {
    console.error('❌ Error al obtener análisis:', error);
    return { success: false, error: error.message };
  }
}

// Cerrar conexión al cerrar la app
function closeDatabase() {
  if (prisma) {
    prisma.$disconnect();
    console.log('✅ Base de datos cerrada');
  }
}

module.exports = {
  initDatabase,
  crearAtleta,
  obtenerAtletas,
  obtenerAtletaPorId,
  actualizarAtleta,
  eliminarAtleta,
  crearAnalisis,
  obtenerAnalisisPorAtleta,
  closeDatabase
};
