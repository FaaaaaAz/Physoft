// ============================================
// RUTAS: Atleta - Presentation Layer
// ============================================
// Define las rutas HTTP para operaciones con atletas
// ============================================

import { Router } from 'express'
import { AtletaController } from '../controllers/atletaController'

const router = Router()

// Rutas CRUD de atletas
router.get('/', AtletaController.getAll)           // GET /api/atletas
router.get('/:id', AtletaController.getById)       // GET /api/atletas/:id
router.post('/', AtletaController.create)          // POST /api/atletas
router.put('/:id', AtletaController.update)        // PUT /api/atletas/:id
router.delete('/:id', AtletaController.delete)     // DELETE /api/atletas/:id

// Ruta de comparación
router.get('/:id/comparar', AtletaController.comparar)  // GET /api/atletas/:id/comparar

export default router
