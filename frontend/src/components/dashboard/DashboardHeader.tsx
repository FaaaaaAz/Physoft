import './DashboardHeader.css'

function DashboardHeader() {
    return (
        <div className="dashboard-header">
            <div className="dashboard-header-greeting">
                <h1 className="dashboard-header-title">Welcome back, Administrator</h1>
                <p className="dashboard-header-subtitle">
                    Here's an overview of your clinic and recent activity.
                </p>
            </div>
        </div>
    )
}

export default DashboardHeader
