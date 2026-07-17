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
import { COMMON_SYSTEM_PROMPT } from './prompts/common/systemPrompt'
import { BIOBIT_PROMPT } from './prompts/textual/biobit'
import { MUSCULAR_ACTIVATION_PROMPT } from './prompts/textual/muscularActivation'
import { INERTIAL_FORCE_PROMPT } from './prompts/textual/inertialForce'
import { FREE_PROMPT } from './prompts/textual/free'

const SPECIALIZED_PROMPTS: Record<ChecklistType, string> = {
  biobit: BIOBIT_PROMPT,
  asymmetry: MUSCULAR_ACTIVATION_PROMPT, // checkboxType 'asymmetry' -> muscularActivation.ts, intentional
  inertialForce: INERTIAL_FORCE_PROMPT,
  free: FREE_PROMPT,
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

export interface BuildUserTextInput {
  checkboxType: ChecklistType
  userPrompt?: string | null
  patientDemographics?: PatientDemographics | null
  patientContextFallback?: PatientContextFallback | null
  previousAssessmentsSummary?: string | null
  evaluationDate?: string | null
  clinicalNotes?: string | null
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

  if (input.clinicalNotes && input.clinicalNotes.trim().length > 0) {
    sections.push(
      section(
        'ADDITIONAL CLINICAL NOTES & DETECTED CONDITIONS (physiotherapist-entered — complementary context for this evaluation, not the main instruction)',
        input.clinicalNotes.trim()
      )
    )
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

function buildAssessmentContextText(input: BuildUserTextInput): string | null {
  const lines: string[] = []

  const date = parseValidDate(input.evaluationDate)
  if (date) lines.push(`Evaluation date: ${date.toISOString().slice(0, 10)}`)

  if (input.previousAssessmentsSummary) lines.push(`Previous assessments: ${input.previousAssessmentsSummary}`)

  return lines.length > 0 ? lines.join('\n') : null
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
