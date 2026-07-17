import type { ChecklistType } from '@/services/api'

export const CHECKLIST_TYPES: ChecklistType[] = ['biobit', 'asymmetry', 'inertialForce', 'free']

export const CHECKLIST_LABELS: Record<ChecklistType, string> = {
    biobit: 'Biobit Analysis',
    asymmetry: 'Muscular Activation Asymmetry',
    inertialForce: 'Inertial Force Analysis',
    free: 'Free'
}

export const CHECKLIST_DESCRIPTIONS: Record<ChecklistType, string> = {
    biobit: 'Muscle activation patterns and coordination',
    asymmetry: 'Bilateral (left vs. right) muscle activation imbalance',
    inertialForce: 'Force generation, absorption and deceleration control',
    free: 'Custom analysis not covered by the options above'
}

export type { ChecklistType }
