// ============================================
// SEED - Sample Data
// ============================================
// Populate the database with sample data for development
// ============================================

import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

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
        id: randomUUID(),
        accessCode: '00001',
        name: 'Lionel Messi',
        gender: 'Male',
        birthDate: '1987-06-24',
        nationality: 'Argentina',
        sport: 'Soccer',
        club: 'Inter Miami',
        position: 'Forward',
        bodyType: 'Mesomorph',
        height: 169.5,
        weight: 69.2,
        email: 'messi@example.com',
        phone: '+1234567890',
      }
    }),
    prisma.athlete.create({
      data: {
        id: randomUUID(),
        accessCode: '00002',
        name: 'Neymar Jr',
        gender: 'Male',
        birthDate: '1992-02-05',
        nationality: 'Brazil',
        sport: 'Soccer',
        club: 'Al Hilal',
        position: 'Forward',
        bodyType: 'Ectomorph',
        height: 175.0,
        weight: 62.5,
        email: 'neymar@example.com',
      }
    }),
    prisma.athlete.create({
      data: {
        id: randomUUID(),
        accessCode: '00003',
        name: 'Cristiano Ronaldo',
        gender: 'Male',
        birthDate: '1985-02-05',
        nationality: 'Portugal',
        sport: 'Soccer',
        club: 'Al Nassr',
        position: 'Forward',
        bodyType: 'Mesomorph',
        height: 187.0,
        weight: 84.0,
        email: 'cr7@example.com',
        phone: '+9876543210',
      }
    }),
    prisma.athlete.create({
      data: {
        id: randomUUID(),
        accessCode: '00004',
        name: 'Antoine Griezmann',
        gender: 'Male',
        birthDate: '1991-03-21',
        nationality: 'France',
        sport: 'Soccer',
        club: 'Atletico Madrid',
        position: 'Forward',
        bodyType: 'Mesomorph',
        height: 175.5,
        weight: 70.0,
      }
    }),
    prisma.athlete.create({
      data: {
        id: randomUUID(),
        accessCode: '00005',
        name: 'Álvaro Morata',
        gender: 'Male',
        birthDate: '1992-10-23',
        nationality: 'Spain',
        sport: 'Soccer',
        club: 'AC Milan',
        position: 'Forward',
        bodyType: 'Ectomorph',
        height: 190.0,
        weight: 84.0,
      }
    }),
  ])

  console.log(`✅ ${athletes.length} athletes created`)

  // Create sample analyses
  console.log('📊 Creating sample analyses...')

  const analyses = await Promise.all([
    // Analysis 1: Complete functional analysis for Messi
    prisma.analysis.create({
      data: {
        athleteId: athletes[0].id,
        evaluationDate: new Date('2024-11-15T10:30:00'),
        graphImages: JSON.stringify([
          '/uploads/graphs/messi-flexibility-chart.png',
          '/uploads/graphs/messi-power-chart.png'
        ]),
        flexibilityAnalysis: 'Excellent hamstring flexibility with 85° hip flexion. Minor limitation in ankle dorsiflexion (10°). Recommend dynamic stretching protocols.',
        biobitAnalysis: 'Muscle activation symmetry at 92%. Optimal firing patterns in quadriceps and glutes. Minor delay in left tibialis anterior (12ms).',
        muscularAsymmetry: 'Right leg dominance evident: 8% higher EMG amplitude. Left adductor complex shows 15% less activation during lateral movements.',
        activeMotorControl: 'Superior proprioceptive response. Single-leg balance test: 45s eyes open, 28s eyes closed. Core stability excellent (95th percentile).',
        functionalMuscleFatigue: 'Fatigue index at 18% after 30-min protocol. Moderate decline in explosive power (-12%) in final sets. Recovery time: 48-52 hours recommended.',
        inertiaForceControl: 'Exceptional deceleration mechanics. Ground reaction forces well-distributed. Eccentric strength ratio: 1.15 (optimal range).',
        weakPoints: JSON.stringify(['Ankle dorsiflexion limitation', 'Left adductor activation', 'Late-stage power endurance']),
        power: 92,
        endurance: 88,
        strength: 85,
        flexibility: 78,
        speed: 94,
        globalClassification: 'high',
        coachRecommendations: 'Focus on left leg unilateral strength work (Bulgarian split squats, single-leg RDLs). Incorporate ankle mobility drills pre-training. Monitor fatigue with HRV tracking. Consider 10% reduction in volume during competition weeks.'
      }
    }),
    // Analysis 2: Post-injury evaluation for Neymar
    prisma.analysis.create({
      data: {
        athleteId: athletes[1].id,
        evaluationDate: new Date('2024-11-20T14:00:00'),
        graphImages: JSON.stringify(['/uploads/graphs/neymar-recovery-chart.png']),
        flexibilityAnalysis: 'Post-hamstring injury assessment. Current ROM: 65° hip flexion (baseline: 80°). Grade 2 strain recovery at 75%. No pain on passive stretch.',
        muscularAsymmetry: 'Significant right hamstring inhibition: 32% lower activation vs left. Compensation pattern in right glute medius (+28% activity).',
        activeMotorControl: 'Protective guarding present. Single-leg balance reduced to 18s (pre-injury: 42s). Recommend progressive neuromuscular re-education.',
        functionalMuscleFatigue: 'Early fatigue onset noted. Reduced work capacity: 65% of baseline. Premature muscle shutdown after 18-min loading protocol.',
        weakPoints: JSON.stringify(['Right hamstring strength deficit', 'Bilateral balance discrepancy', 'Premature fatigue in injured limb']),
        power: 68,
        endurance: 62,
        strength: 58,
        flexibility: 52,
        speed: 70,
        globalClassification: 'low',
        coachRecommendations: 'Continue Phase 2 rehab protocol. Isometric holds (3x30s) + Nordic curls (2x6). Avoid high-speed running >75% max velocity for 2 weeks. Pool-based conditioning for endurance maintenance. RTP criteria: >85% LSI (Limb Symmetry Index).'
      }
    }),
    // Analysis 3: Elite performance profile for Cristiano Ronaldo
    prisma.analysis.create({
      data: {
        athleteId: athletes[2].id,
        evaluationDate: new Date('2024-11-25T09:00:00'),
        graphImages: JSON.stringify([
          '/uploads/graphs/cr7-full-spectrum.png',
          '/uploads/graphs/cr7-power-curve.png',
          '/uploads/graphs/cr7-fatigue-resistance.png'
        ]),
        flexibilityAnalysis: 'Outstanding multi-planar mobility. Hip IR/ER: 50°/55° (elite). Thoracic rotation: 75° bilateral. Zero restrictions noted across all major joints.',
        biobitAnalysis: 'Near-perfect muscle activation patterns. Bilateral symmetry: 98.5%. Pre-activation timing optimal (<30ms pre-contact). Quadriceps-hamstring co-contraction ratio: 0.68 (ideal).',
        muscularAsymmetry: 'Minimal asymmetry detected: 3% variance (within physiological norm). Slightly higher peak force in right leg during CMJ (+4%).',
        activeMotorControl: 'Exceptional neuromuscular efficiency. Postural sway: 2.1mm (elite threshold: <5mm). Reactive strength index: 2.8 (world-class).',
        functionalMuscleFatigue: 'Superior fatigue resistance. Power drop-off: 6% over 45-min protocol (elite: <10%). Lactate clearance rate: 1.8 mmol/L/min (excellent).',
        inertiaForceControl: 'Elite-level force absorption. Peak GRF during landing: 2.8x BW (controlled). Stiffness regulation excellent across all movement speeds.',
        weakPoints: JSON.stringify(['Minor right-side dominance in jumping', 'Potential overtraining risk (chronic HRV suppression)', 'Age-related recovery considerations']),
        power: 96,
        endurance: 94,
        strength: 93,
        flexibility: 89,
        speed: 91,
        globalClassification: 'high',
        coachRecommendations: 'Maintain current training load but prioritize recovery strategies: 8+ hours sleep, contrast therapy post-matches. Add 1 extra rest day per week during congested fixtures. Introduce low-intensity aerobic sessions (HR <65%) for active recovery. Monitor adductor load (historical injury site). Continue prehab: Copenhagen planks + Y-balance drills.'
      }
    }),
    // Analysis 4: Youth athlete development profile for Griezmann
    prisma.analysis.create({
      data: {
        athleteId: athletes[3].id,
        evaluationDate: new Date('2024-11-28T16:30:00'),
        biobitAnalysis: 'Age-appropriate activation patterns. Still developing optimal firing sequences. Quadriceps-dominant movement strategy (typical for age group).',
        muscularAsymmetry: 'Left leg preference: 12% higher peak force. Common in developing athletes. Recommend bilateral training emphasis.',
        activeMotorControl: 'Good foundational control. Balance scores: 75th percentile for age. Room for improvement in dynamic stability tasks.',
        weakPoints: JSON.stringify(['Left-right strength imbalance', 'Underdeveloped posterior chain', 'Limited power endurance']),
        power: 72,
        endurance: 78,
        strength: 68,
        flexibility: 82,
        speed: 75,
        globalClassification: 'medium',
        coachRecommendations: 'Age-appropriate strength program: bodyweight emphasis + goblet squats/KB swings. Unilateral training: lunges, step-ups (3x8 each leg). Plyometric foundation: pogos, box jumps (<12 inches). Prioritize movement quality over intensity. Fun-based conditioning games to build aerobic base.'
      }
    })
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



