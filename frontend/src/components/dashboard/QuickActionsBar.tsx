import { useNavigate } from 'react-router-dom'
import { IoPersonAdd, IoAddCircle, IoDocuments, IoDownload, IoPeople } from 'react-icons/io5'
import { ConsentModal, useConsentGate } from '@/components/ConsentModal'
import { ROUTES } from '../../constants'
import './QuickActionsBar.css'

function QuickActionsBar() {
    const navigate = useNavigate()
    const newAssessmentConsent = useConsentGate(ROUTES.NEW_ANALYSIS)

    return (
        <div className="quick-actions-bar">
            <button className="quick-action-btn" onClick={() => navigate(ROUTES.ADD_ATHLETE)}>
                <IoPersonAdd />
                Add Patient
            </button>
            <button className="quick-action-btn" onClick={newAssessmentConsent.requestAccess}>
                <IoAddCircle />
                New Assessment
            </button>
            <button className="quick-action-btn" onClick={() => navigate(ROUTES.ALL_ANALYSES)}>
                <IoDocuments />
                All Assessments
            </button>
            <button className="quick-action-btn" onClick={() => navigate(ROUTES.ALL_PATIENTS)}>
                <IoPeople />
                All Patients
            </button>
            <button className="quick-action-btn quick-action-btn-disabled" disabled title="Coming soon">
                <IoDownload />
                Generate Report
                <span className="quick-action-soon">Soon</span>
            </button>

            <ConsentModal
                isOpen={newAssessmentConsent.isOpen}
                onCancel={newAssessmentConsent.cancel}
                onAccept={newAssessmentConsent.accept}
            />
        </div>
    )
}

export default QuickActionsBar
