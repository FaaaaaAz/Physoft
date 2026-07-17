// ============================================
// TYPES: Claude Textual Analysis
// ============================================
// Pure types/constants only — no service instantiation here, so this can be
// statically imported (e.g. by the controller for request validation)
// without eagerly constructing the Claude client / requiring an API key.
// ============================================

export type ChecklistType = 'biobit' | 'asymmetry' | 'inertialForce' | 'free'

export const CHECKLIST_TYPES: ChecklistType[] = ['biobit', 'asymmetry', 'inertialForce', 'free']

export const CHECKLIST_LABELS: Record<ChecklistType, string> = {
    biobit: 'Biobit Analysis',
    asymmetry: 'Muscular Activation Asymmetry',
    inertialForce: 'Inertial Force Analysis',
    free: 'Free'
}
