import { useNavigate } from 'react-router-dom'
import { IoPersonAdd, IoAddCircle, IoDocuments, IoDownload } from 'react-icons/io5'
import { ROUTES } from '../../constants'
import './QuickActionsBar.css'

function QuickActionsBar() {
    const navigate = useNavigate()

    return (
        <div className="quick-actions-bar">
            <button className="quick-action-btn" onClick={() => navigate(ROUTES.ADD_ATHLETE)}>
                <IoPersonAdd />
                Add Patient
            </button>
            <button className="quick-action-btn" onClick={() => navigate(ROUTES.NEW_ANALYSIS)}>
                <IoAddCircle />
                New Assessment
            </button>
            <button className="quick-action-btn" onClick={() => navigate(ROUTES.ALL_ANALYSES)}>
                <IoDocuments />
                All Assessments
            </button>
            <button className="quick-action-btn quick-action-btn-disabled" disabled title="Coming soon">
                <IoDownload />
                Generate Report
                <span className="quick-action-soon">Soon</span>
            </button>
        </div>
    )
}

export default QuickActionsBar
