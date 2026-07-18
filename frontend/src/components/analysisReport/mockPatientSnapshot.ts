// ============================================
// MOCK DATA: Patient Snapshot (at evaluation time)
// ============================================
// UI-only placeholder for the physical measurements recorded during THIS
// specific evaluation. Weight/height/somatotype can change between
// evaluations, so this is intentionally kept separate from the athlete's
// current profile (Athlete.weight/height/bodyType) — swap for real
// per-evaluation fields once the backend captures them on Analysis.
// ============================================

export interface PatientSnapshotData {
    weight: string
    height: string
    somatotype: string
}

export const patientSnapshotMock: PatientSnapshotData = {
    weight: '154 lbs',
    height: '5.75 ft',
    somatotype: 'Mesomorph'
}
