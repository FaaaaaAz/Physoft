// ============================================
// CONTROLADOR: Atleta - Presentation Layer
// ============================================
// Maneja las peticiones HTTP relacionadas con atletas
// ============================================

import { Request, Response } from 'express'
import { prisma } from '../../infrastructure/prismaClient'
import { ComparacionService } from '../../application/services/ComparacionService'

export class AtletaController {
  /**
   * GET /api/atletas
   * Obtiene todos los atletas
   */
  static async getAll(req: Request, res: Response) {
    try {
      const atletas = await prisma.atleta.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })

      res.json({
        success: true,
        data: atletas,
        total: atletas.length,
      })
    } catch (error) {
      console.error('Error al obtener atletas:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener atletas',
      })
    }
  }

  /**
   * GET /api/atletas/:id
   * Obtiene un atleta por ID
   */
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const atleta = await prisma.atleta.findUnique({
        where: { id: parseInt(id) },
        include: {
          analisis: true, // Incluir análisis relacionados
        },
      })

      if (!atleta) {
        return res.status(404).json({
          success: false,
          error: 'Atleta no encontrado',
        })
      }

      res.json({
        success: true,
        data: atleta,
      })
    } catch (error) {
      console.error('Error al obtener atleta:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener atleta',
      })
    }
  }

  /**
   * POST /api/atletas
   * Crea un nuevo atleta
   */
  static async create(req: Request, res: Response) {
    try {
      const { nombre, genero, disciplina, posicion, somatotipo, altura, peso, edad } = req.body

      // Validaciones básicas
      if (!nombre || !genero || !disciplina || !somatotipo || !altura || !peso || !edad) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos',
        })
      }

      const nuevoAtleta = await prisma.atleta.create({
        data: {
          nombre,
          genero,
          disciplina,
          posicion,
          somatotipo,
          altura: parseFloat(altura),
          peso: parseFloat(peso),
          edad: parseInt(edad),
        },
      })

      res.status(201).json({
        success: true,
        data: nuevoAtleta,
        message: 'Atleta creado exitosamente',
      })
    } catch (error) {
      console.error('Error al crear atleta:', error)
      res.status(500).json({
        success: false,
        error: 'Error al crear atleta',
      })
    }
  }

  /**
   * PUT /api/atletas/:id
   * Actualiza un atleta
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { nombre, genero, disciplina, posicion, somatotipo, altura, peso, edad } = req.body

      const atletaActualizado = await prisma.atleta.update({
        where: { id: parseInt(id) },
        data: {
          ...(nombre && { nombre }),
          ...(genero && { genero }),
          ...(disciplina && { disciplina }),
          ...(posicion !== undefined && { posicion }),
          ...(somatotipo && { somatotipo }),
          ...(altura && { altura: parseFloat(altura) }),
          ...(peso && { peso: parseFloat(peso) }),
          ...(edad && { edad: parseInt(edad) }),
        },
      })

      res.json({
        success: true,
        data: atletaActualizado,
        message: 'Atleta actualizado exitosamente',
      })
    } catch (error) {
      console.error('Error al actualizar atleta:', error)
      res.status(500).json({
        success: false,
        error: 'Error al actualizar atleta',
      })
    }
  }

  /**
   * DELETE /api/atletas/:id
   * Elimina un atleta
   */
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params

      await prisma.atleta.delete({
        where: { id: parseInt(id) },
      })

      res.json({
        success: true,
        message: 'Atleta eliminado exitosamente',
      })
    } catch (error) {
      console.error('Error al eliminar atleta:', error)
      res.status(500).json({
        success: false,
        error: 'Error al eliminar atleta',
      })
    }
  }

  /**
   * GET /api/atletas/:id/comparar
   * Compara un atleta con su cohorte
   */
  static async comparar(req: Request, res: Response) {
    try {
      const { id } = req.params
      const resultado = await ComparacionService.compararConCohorte(parseInt(id))

      res.json({
        success: true,
        data: resultado,
      })
    } catch (error) {
      console.error('Error al comparar atleta:', error)
      res.status(500).json({
        success: false,
        error: 'Error al comparar atleta',
      })
    }
  }
}
