// ============================================
// SERVICE: Claude Prompt Builder
// ============================================
// The only file in this module with logic. Assembles the system prompt
// (static per checkboxType) and the user message's context text (fully
// dynamic, built fresh per request) as clearly labeled sections. Image/PDF
// content blocks are NOT built here — that stays in claudeAnalysisService,
// this module only ever produces text.
// ============================================

import { ChecklistType, CHECKLIST_LABELS } from '../../../domain/types/claudeAnalysis'
import type { FlexibilityExerciseId, FlexibilityRating } from '../../../domain/types/flexibilityAssessment'
import { COMMON_SYSTEM_PROMPT } from './prompts/common/systemPrompt'
import { FLEXIBILITY_PROMPT } from './prompts/textual/flexibility'
import { BIOBIT_PROMPT } from './prompts/textual/biobit'
import { MUSCULAR_ACTIVATION_PROMPT } from './prompts/textual/muscularActivation'
import { MOTOR_CONTROL_PROMPT } from './prompts/textual/motorControl'
import { FREE_PROMPT } from './prompts/textual/free'

const SPECIALIZED_PROMPTS: Record<ChecklistType, string> = {
  flexibility: FLEXIBILITY_PROMPT,
  biobit: BIOBIT_PROMPT,
  asymmetry: MUSCULAR_ACTIVATION_PROMPT, // checkboxType 'asymmetry' -> muscularActivation.ts, intentional
  motorControl: MOTOR_CONTROL_PROMPT,
  free: FREE_PROMPT,
}

const EXERCISE_LABELS: Record<FlexibilityExerciseId, string> = {
  forwardFlexion: 'Forward Flexion Test',
  shoulderMobility: 'Shoulder Mobility Test',
  butterfly: 'Butterfly Test',
  deepSquat: 'Deep Squat Test',
}

const VIEW_LABELS: Record<string, string> = {
  front: 'front view',
  back: 'back view',
  left: 'left side view',
  right: 'right side view',
}

export interface PatientDemographics {
  name?: string
  age?: number
  gender?: string
  sport?: string
  height?: number
  weight?: number
  patientType?: string
}

export interface PatientContextFallback {
  name?: string
  age?: number
  sport?: string
}

export interface BodyMarkLike {
  viewType: 'front' | 'back' | 'left' | 'right'
}

export interface FlexibilityRatingContext {
  exerciseId: FlexibilityExerciseId
  rating: FlexibilityRating | null
  hasEvidence: boolean
}

export interface BuildUserTextInput {
  checkboxType: ChecklistType
  userPrompt?: string | null
  patientDemographics?: PatientDemographics | null
  patientContextFallback?: PatientContextFallback | null
  previousAssessmentsSummary?: string | null
  evaluationDate?: string | null
  bodyMarks?: BodyMarkLike[] | null
  flexibilityRatings?: FlexibilityRatingContext[] | null
  hasAttachments: boolean
}

export function getSystemPrompt(checkboxType: ChecklistType): string {
  return [
    '=== SYSTEM INSTRUCTIONS ===',
    COMMON_SYSTEM_PROMPT,
    '',
    `=== SPECIALIZED INSTRUCTIONS: ${CHECKLIST_LABELS[checkboxType]} ===`,
    SPECIALIZED_PROMPTS[checkboxType],
  ].join('\n')
}

export function buildUserText(input: BuildUserTextInput): string {
  const sections: string[] = []

  const patientText = buildPatientContextText(input)
  if (patientText) sections.push(section('PATIENT CONTEXT', patientText))

  const assessmentText = buildAssessmentContextText(input)
  if (assessmentText) sections.push(section('ASSESSMENT CONTEXT', assessmentText))

  if (input.checkboxType === 'flexibility') {
    const ratedExercises = (input.flexibilityRatings || []).filter((r) => r.rating !== null)
    if (ratedExercises.length > 0) {
      sections.push(
        section(
          'MANUAL FLEXIBILITY RATINGS (physiotherapist-entered — verify against the image, do not assume correct)',
          buildFlexibilityRatingsText(ratedExercises)
        )
      )
    }
  }

  if (input.userPrompt && input.userPrompt.trim().length > 0) {
    sections.push(section("PHYSIOTHERAPIST'S ADDITIONAL PROMPT", input.userPrompt.trim()))
  }

  sections.push(section('REQUESTED ANALYSIS', buildRequestedAnalysisText(input)))

  return sections.join('\n\n')
}

function section(title: string, body: string): string {
  return `=== ${title} ===\n${body}`
}

function mergePatientDemographics(input: BuildUserTextInput) {
  const demo = input.patientDemographics || {}
  const fallback = input.patientContextFallback || {}
  return {
    name: demo.name || fallback.name,
    age: demo.age ?? fallback.age,
    gender: demo.gender,
    sport: demo.sport || fallback.sport,
    height: demo.height,
    weight: demo.weight,
    patientType: demo.patientType,
  }
}

function buildPatientContextText(input: BuildUserTextInput): string | null {
  const p = mergePatientDemographics(input)
  const lines: string[] = []

  if (p.name) lines.push(`Name: ${p.name}`)
  if (p.age !== undefined) lines.push(`Age: ${p.age}`)
  if (p.gender) lines.push(`Sex: ${p.gender}`)
  if (p.sport) lines.push(`Sport: ${p.sport}`)
  if (p.height !== undefined) lines.push(`Height: ${p.height} ft`)
  if (p.weight !== undefined) lines.push(`Weight: ${p.weight} lbs`)
  if (p.patientType) lines.push(`Patient type: ${p.patientType}`)

  return lines.length > 0 ? lines.join('\n') : null
}

function parseValidDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : date
}

function summarizeBodyMarks(marks: BodyMarkLike[] | null | undefined): string | null {
  if (!marks || marks.length === 0) return null

  const counts: Record<string, number> = {}
  for (const mark of marks) {
    counts[mark.viewType] = (counts[mark.viewType] || 0) + 1
  }

  const parts = Object.entries(counts).map(([view, count]) => `${count} on the ${VIEW_LABELS[view] || view}`)
  return `${marks.length} total (${parts.join(', ')})`
}

function buildAssessmentContextText(input: BuildUserTextInput): string | null {
  const lines: string[] = []

  const date = parseValidDate(input.evaluationDate)
  if (date) lines.push(`Evaluation date: ${date.toISOString().slice(0, 10)}`)

  const zonesSummary = summarizeBodyMarks(input.bodyMarks)
  if (zonesSummary) lines.push(`Affected zones marked by the physiotherapist: ${zonesSummary}`)

  if (input.previousAssessmentsSummary) lines.push(`Previous assessments: ${input.previousAssessmentsSummary}`)

  return lines.length > 0 ? lines.join('\n') : null
}

function buildFlexibilityRatingsText(ratings: FlexibilityRatingContext[]): string {
  return ratings
    .map((r) => {
      const evidenceNote = r.hasEvidence ? 'evidence photo attached' : 'no evidence photo provided'
      return `${EXERCISE_LABELS[r.exerciseId]}: ${r.rating} (${evidenceNote})`
    })
    .join('\n')
}

function buildRequestedAnalysisText(input: BuildUserTextInput): string {
  if (input.checkboxType === 'free') {
    return "Perform the analysis as instructed in the physiotherapist's prompt above, following the Free Analysis specialized instructions."
  }

  const label = CHECKLIST_LABELS[input.checkboxType]
  const attachmentNote = input.hasAttachments
    ? 'based on the attached file(s) above'
    : '(no files were attached -- base the analysis on the prompt and context provided alone)'

  return `Please perform a ${label} ${attachmentNote}, following the specialized instructions above.`
}
