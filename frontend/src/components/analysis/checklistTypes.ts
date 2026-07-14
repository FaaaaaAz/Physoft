import type { ChecklistType } from '@/services/api'

export const CHECKLIST_TYPES: ChecklistType[] = ['flexibility', 'biobit', 'asymmetry', 'motorControl', 'free']

export const CHECKLIST_LABELS: Record<ChecklistType, string> = {
    flexibility: 'Flexibility Analysis',
    biobit: 'Biobit Analysis',
    asymmetry: 'Muscular Activation Asymmetry',
    motorControl: 'Active Motor Control Analysis',
    free: 'Free'
}

export const CHECKLIST_DESCRIPTIONS: Record<ChecklistType, string> = {
    flexibility: 'Range of motion, joint flexibility and relaxation',
    biobit: 'Muscle activation patterns and coordination',
    asymmetry: 'Bilateral (left vs. right) muscle activation imbalance',
    motorControl: 'Neuromuscular stability and movement control',
    free: 'Custom analysis not covered by the options above'
}

export type { ChecklistType }
