import { IoLayersOutline } from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import ComingSoon from '@/components/common/feedback/ComingSoon'

function Protocols() {
    return (
        <PageTemplate className="protocols-page">
            <ComingSoon
                icon={<IoLayersOutline />}
                title="Protocols"
                description="Build, manage and assign rehabilitation and training protocols. This module is coming soon."
            />
        </PageTemplate>
    )
}

export default Protocols
