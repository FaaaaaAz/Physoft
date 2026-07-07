import { IoDocumentTextOutline } from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import ComingSoon from '@/components/common/feedback/ComingSoon'

function Reports() {
    return (
        <PageTemplate className="reports-page">
            <ComingSoon
                icon={<IoDocumentTextOutline />}
                title="Reports"
                description="Generate and export professional clinical reports for your patients. This module is on the way."
            />
        </PageTemplate>
    )
}

export default Reports
