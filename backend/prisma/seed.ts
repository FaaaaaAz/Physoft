// ============================================
// SEED - Sample Data
// ============================================
// Populate the database with sample data for development
// ============================================

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.analysis.deleteMany()
  await prisma.athlete.deleteMany()

  // Create sample athletes
  console.log('👥 Creating sample athletes...')
  
  const athletes = await Promise.all([
    prisma.athlete.create({
      data: {
        name: 'Lionel Messi',
        gender: 'Masculino',
        sport: 'Fútbol',
        position: 'Delantero',
        bodyType: 'Mesomorfo',
        height: 169.5,
        weight: 69.2,
        age: 37,
      }
    }),
    prisma.athlete.create({
      data: {
        name: 'Neymar JR',
        gender: 'Masculino',
        sport: 'Fútbol',
        position: 'Delantero',
        bodyType: 'Ectomorfo',
        height: 175.0,
        weight: 62.5,
        age: 35,
      }
    }),
    prisma.athlete.create({
      data: {
        name: 'Cristiano Ronaldo',
        gender: 'Masculino',
        sport: 'Fútbol',
        position: 'Delantero',
        bodyType: 'Mesomorfo',
        height: 187.0,
        weight: 80.0,
        age: 40,
      }
    }),
    prisma.athlete.create({
      data: {
        name: 'Antoine Griezmann',
        gender: 'Masculino',
        sport: 'Fútbol',
        position: 'Delantero',
        bodyType: 'Mesomorfo',
        height: 175.5,
        weight: 70.0,
        age: 33,
      }
    }),
    prisma.athlete.create({
      data: {
        name: 'Álvaro Morata',
        gender: 'Masculino',
        sport: 'Fútbol',
        bodyType: 'Ectomorfo',
        height: 182.0,
        weight: 77.0,
        age: 32,
      }
    }),
  ])

  console.log(`✅ ${athletes.length} athletes created`)

  // Create sample analyses
  console.log('📊 Creating sample analyses...')

  const btsAnalysisData = {
    flexion_cadera: 45,
    extension_rodilla: 30,
    dorsiflexion_tobillo: 20,
    abduccion_hombro: 90,
    rotacion_interna: 60,
    rotacion_externa: 70,
    balance_muscular: 'Simétrico',
    rango_movimiento: 'Normal'
  }

  const analyses = await Promise.all([
    // Analysis for Carlos Rodríguez
    prisma.analysis.create({
      data: {
        athleteId: athletes[0].id,
        analysisType: 'BTS',
        dataJson: JSON.stringify(btsAnalysisData),
        overallStatus: 'High',
        weakPoint1: 'Hip obliquity',
        weakPoint2: 'Activation balance',
        weakPoint3: 'Left leg balance',
        improvementMargin: 15.5,
      }
    }),
    // Analysis for Ana Martínez
    prisma.analysis.create({
      data: {
        athleteId: athletes[1].id,
        analysisType: 'BTS',
        dataJson: JSON.stringify({
          ...btsAnalysisData,
          flexion_cadera: 50,
          balance_muscular: 'Asymmetric'
        }),
        overallStatus: 'Average',
        weakPoint1: 'Core strength',
        weakPoint2: 'Ankle stability',
        improvementMargin: 22.0,
      }
    }),
    // Analysis for Diego Fernández
    prisma.analysis.create({
      data: {
        athleteId: athletes[2].id,
        analysisType: 'Biomechanical',
        dataJson: JSON.stringify({
          ...btsAnalysisData,
          extension_rodilla: 35,
          rango_movimiento: 'Excellent'
        }),
        overallStatus: 'High',
        weakPoint1: 'Shoulder rotation',
        weakPoint2: 'Lumbar flexibility',
        improvementMargin: 10.0,
      }
    }),
    // Second analysis for Carlos (progress)
    prisma.analysis.create({
      data: {
        athleteId: athletes[0].id,
        analysisType: 'BTS',
        dataJson: JSON.stringify({
          ...btsAnalysisData,
          flexion_cadera: 48,
          balance_muscular: 'Improved'
        }),
        overallStatus: 'High',
        weakPoint1: 'Hip obliquity',
        improvementMargin: 12.0,
        analysisDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      }
    }),
  ])

  console.log(`✅ ${analyses.length} analyses created`)

  console.log('✨ Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   - ${athletes.length} athletes`)
  console.log(`   - ${analyses.length} analyses`)
  console.log('\n🚀 You can start the server with: npm run dev')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



