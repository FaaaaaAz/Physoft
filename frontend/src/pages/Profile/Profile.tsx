import { useEffect } from 'react'
import { IoPerson, IoMail, IoBriefcase, IoShield, IoCalendar } from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import './Profile.css'

function Profile() {

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <PageTemplate
            title="Perfil del Administrador"
            subtitle="Información del usuario principal de Physoft"
            showBackButton={true}
            breadcrumbItems={[
                { label: 'Inicio', path: '/dashboard' },
                { label: 'Perfil' }
            ]}
        >
            <div className="profile-container">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        <IoPerson />
                    </div>
                    <div className="profile-info">
                        <h2>Administrador</h2>
                        <p className="profile-role">Rol: Administrador Principal</p>
                    </div>
                </div>

                {/* Information Section */}
                <div className="profile-section">
                    <div className="profile-section-header">
                        <IoShield className="section-icon" />
                        <h3>Información General</h3>
                    </div>
                    <div className="profile-details">
                        <div className="profile-detail-item">
                            <div className="detail-icon">
                                <IoPerson />
                            </div>
                            <div className="detail-info">
                                <p className="detail-label">Nombre</p>
                                <p className="detail-value">Administrador Physoft</p>
                            </div>
                        </div>
                        <div className="profile-detail-item">
                            <div className="detail-icon">
                                <IoMail />
                            </div>
                            <div className="detail-info">
                                <p className="detail-label">Email</p>
                                <p className="detail-value">admin@physoft.com</p>
                            </div>
                        </div>
                        <div className="profile-detail-item">
                            <div className="detail-icon">
                                <IoBriefcase />
                            </div>
                            <div className="detail-info">
                                <p className="detail-label">Organización</p>
                                <p className="detail-value">Physoft Sports Analytics</p>
                            </div>
                        </div>
                        <div className="profile-detail-item">
                            <div className="detail-icon">
                                <IoCalendar />
                            </div>
                            <div className="detail-info">
                                <p className="detail-label">Miembro desde</p>
                                <p className="detail-value">Diciembre 2025</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="profile-section">
                    <div className="profile-section-header">
                        <IoShield className="section-icon" />
                        <h3>Estadísticas de Uso</h3>
                    </div>
                    <div className="profile-stats">
                        <div className="stat-card">
                            <p className="stat-value">Ilimitado</p>
                            <p className="stat-label">Atletas Registrados</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-value">Ilimitado</p>
                            <p className="stat-label">Análisis Realizados</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-value">Premium</p>
                            <p className="stat-label">Plan Actual</p>
                        </div>
                    </div>
                </div>

                {/* Permissions Section */}
                <div className="profile-section">
                    <div className="profile-section-header">
                        <IoShield className="section-icon" />
                        <h3>Permisos</h3>
                    </div>
                    <div className="profile-permissions">
                        <div className="permission-item">
                            <IoShield className="permission-icon" />
                            <span>Acceso completo al sistema</span>
                        </div>
                        <div className="permission-item">
                            <IoShield className="permission-icon" />
                            <span>Gestión de atletas</span>
                        </div>
                        <div className="permission-item">
                            <IoShield className="permission-icon" />
                            <span>Creación y edición de análisis</span>
                        </div>
                        <div className="permission-item">
                            <IoShield className="permission-icon" />
                            <span>Análisis con IA</span>
                        </div>
                    </div>
                </div>
            </div>
        </PageTemplate>
    )
}

export default Profile
