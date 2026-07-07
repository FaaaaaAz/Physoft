import { IoBarChartOutline } from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import ComingSoon from '@/components/common/feedback/ComingSoon'

function Analytics() {
    return (
        <PageTemplate className="analytics-page">
            <ComingSoon
                icon={<IoBarChartOutline />}
                title="Analytics"
                description="Advanced performance analytics, trends and cohort comparisons will be available here soon."
            />
        </PageTemplate>
    )
}

export default Analytics
