import { useEffect } from 'react'
import { IoNotifications, IoLockClosed, IoColorPalette, IoLanguage, IoInformationCircle } from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import './Settings.css'

function Settings() {

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <PageTemplate
            title="Settings"
            subtitle="Customize your Physoft experience"
            showBackButton={true}
            breadcrumbItems={[
                { label: 'Home', path: '/dashboard' },
                { label: 'Settings' }
            ]}
        >
            <div className="settings-container">
                {/* Notifications */}
                <div className="config-section">
                    <div className="config-section-header">
                        <IoNotifications className="config-icon" />
                        <h3>Notifications</h3>
                    </div>
                    <div className="config-options">
                        <div className="config-option">
                            <div className="option-info">
                                <p className="option-title">Email notifications</p>
                                <p className="option-description">Receive updates about assessments and patients</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="config-option">
                            <div className="option-info">
                                <p className="option-title">Analysis reminders</p>
                                <p className="option-description">We'll remind you to perform periodic assessments</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="config-section">
                    <div className="config-section-header">
                        <IoLockClosed className="config-icon" />
                        <h3>Security</h3>
                    </div>
                    <div className="config-options">
                        <div className="config-option">
                            <div className="option-info">
                                <p className="option-title">Change password</p>
                                <p className="option-description">Update your password regularly</p>
                            </div>
                            <button className="config-btn">Change</button>
                        </div>
                        <div className="config-option">
                            <div className="option-info">
                                <p className="option-title">Autenticación de dos factores</p>
                                <p className="option-description">Añade una capa extra de seguridad</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="config-section">
                    <div className="config-section-header">
                        <IoColorPalette className="config-icon" />
                        <h3>Appearance</h3>
                    </div>
                    <div className="config-options">
                        <div className="config-option">
                            <div className="option-info">
                                <p className="option-title">Dark theme</p>
                                <p className="option-description">Currently active (default)</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked disabled />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Language */}
                <div className="config-section">
                    <div className="config-section-header">
                        <IoLanguage className="config-icon" />
                        <h3>Language & Region</h3>
                    </div>
                    <div className="config-options">
                        <div className="config-option">
                            <div className="option-info">
                                <p className="option-title">Language</p>
                                <p className="option-description">Select your preferred language</p>
                            </div>
                            <select className="config-select">
                                <option value="es">Español</option>
                                <option value="en">English</option>
                                <option value="pt">Português</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* About */}
                <div className="config-section">
                    <div className="config-section-header">
                        <IoInformationCircle className="config-icon" />
                        <h3>About</h3>
                    </div>
                    <div className="config-options">
                        <div className="config-option">
                            <div className="option-info">
                                <p className="option-title">Physoft Version</p>
                                <p className="option-description">1.0.0 Beta</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTemplate>
    )
}

export default Settings
