// ============================================
// TYPES: Claude Textual Analysis
// ============================================
// Pure types/constants only — no service instantiation here, so this can be
// statically imported (e.g. by the controller for request validation)
// without eagerly constructing the Claude client / requiring an API key.
// ============================================

export type ChecklistType = 'flexibility' | 'biobit' | 'asymmetry' | 'motorControl' | 'free'

export const CHECKLIST_TYPES: ChecklistType[] = ['flexibility', 'biobit', 'asymmetry', 'motorControl', 'free']

export const CHECKLIST_LABELS: Record<ChecklistType, string> = {
    flexibility: 'Flexibility Analysis',
    biobit: 'Biobit Analysis',
    asymmetry: 'Muscular Activation Asymmetry',
    motorControl: 'Active Motor Control Analysis',
    free: 'Free'
}
