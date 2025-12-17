import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IoSave, IoCamera } from 'react-icons/io5'
import PageTemplate from '@/components/templates/PageTemplate'
import LoadingSpinner from '@/components/common/feedback/LoadingSpinner'
import { athleteAPI } from '@/services/api'
import { useAthleteStore } from '@/store/athleteStore'
import './EditAthlete.css'

function EditAthlete() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { updateAthlete: updateAthleteInStore } = useAthleteStore()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        birthDate: '',
        nationality: '',
        sport: '',
        club: '',
        position: '',
        bodyType: '',
        height: '',
        weight: '',
        email: '',
        phone: '',
        photo: null as File | null,
        currentPhotoUrl: ''
    })

    useEffect(() => {
        if (id) {
            loadAthlete(id)
        }
    }, [id])

    const loadAthlete = async (athleteId: string) => {
        try {
            setLoading(true)
            const response = await athleteAPI.getById(athleteId)
            const athlete = response.data

            setFormData({
                name: athlete.name,
                gender: athlete.gender,
                birthDate: athlete.birthDate || '',
                nationality: athlete.nationality || '',
                sport: athlete.sport,
                club: athlete.club || '',
                position: athlete.position || '',
                bodyType: athlete.bodyType,
                height: athlete.height.toString(),
                weight: athlete.weight.toString(),
                email: athlete.email || '',
                phone: athlete.phone || '',
                photo: null,
                currentPhotoUrl: athlete.photo || ''
            })
        } catch (error) {
            console.error('Error loading athlete:', error)
            setMensaje({ tipo: 'error', texto: 'Error al cargar atleta' })
        } finally {
            setLoading(false)
        }
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, photo: e.target.files![0] }))
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!id) return

        try {
            setSaving(true)
            setMensaje(null)

            // Update basic data
            const updateData = {
                name: formData.name,
                gender: formData.gender,
                birthDate: formData.birthDate || undefined,
                nationality: formData.nationality || undefined,
                sport: formData.sport,
                club: formData.club || undefined,
                position: formData.position || undefined,
                bodyType: formData.bodyType,
                height: parseFloat(formData.height),
                weight: parseFloat(formData.weight),
                email: formData.email || undefined,
                phone: formData.phone || undefined
            }

            const response = await athleteAPI.update(id, updateData)

            // Upload new photo if selected
            let finalAthlete = response.data
            if (formData.photo) {
                const photoResponse = await athleteAPI.uploadPhoto(id, formData.photo)
                finalAthlete = photoResponse.data
            }

            // Update store with final athlete data
            updateAthleteInStore(id, finalAthlete)

            setMensaje({ tipo: 'success', texto: 'Atleta actualizado exitosamente' })

            setTimeout(() => {
                navigate(`/athlete-detail/${id}`)
            }, 1500)
        } catch (error: any) {
            console.error('Error updating athlete:', error)
            setMensaje({ tipo: 'error', texto: error.response?.data?.error || 'Error al actualizar atleta' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <PageTemplate title="Cargando..." subtitle="">
                <LoadingSpinner message="Cargando datos del atleta..." />
            </PageTemplate>
        )
    }

    return (
        <PageTemplate
            title="Editar Atleta"
            subtitle="Actualiza la información del atleta"
            className="edit-athlete-page"
            showBackButton={true}
            breadcrumbItems={[
                { label: 'Inicio', path: '/dashboard' },
                { label: 'Atleta', path: `/athlete-detail/${id}` },
                { label: 'Editar' }
            ]}
        >

            <form onSubmit={handleSubmit} className="edit-athlete-form">
                {mensaje && (
                    <div className={`mensaje mensaje-${mensaje.tipo}`}>
                        {mensaje.texto}
                    </div>
                )}

                {/* Photo Section */}
                <div className="form-section photo-section">
                    <h3>Foto del Atleta</h3>
                    <div className="photo-upload">
                        {(formData.currentPhotoUrl || formData.photo) && (
                            <img
                                src={formData.photo ? URL.createObjectURL(formData.photo) : formData.currentPhotoUrl}
                                alt="Preview"
                                className="photo-preview"
                            />
                        )}
                        <label htmlFor="photo" className="photo-label">
                            <IoCamera />
                            {formData.photo ? 'Cambiar Foto' : 'Seleccionar Nueva Foto'}
                        </label>
                        <input
                            type="file"
                            id="photo"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                {/* Personal Information */}
                <div className="form-section">
                    <h3>Información Personal</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Nombre Completo *</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">Género *</label>
                            <select
                                id="gender"
                                value={formData.gender}
                                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="birthDate">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                id="birthDate"
                                value={formData.birthDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nationality">Nacionalidad</label>
                            <input
                                type="text"
                                id="nationality"
                                value={formData.nationality}
                                onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Sports Information */}
                <div className="form-section">
                    <h3>Información Deportiva</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="sport">Deporte *</label>
                            <input
                                type="text"
                                id="sport"
                                value={formData.sport}
                                onChange={(e) => setFormData(prev => ({ ...prev, sport: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="club">Club/Equipo</label>
                            <input
                                type="text"
                                id="club"
                                value={formData.club}
                                onChange={(e) => setFormData(prev => ({ ...prev, club: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="position">Posición</label>
                            <input
                                type="text"
                                id="position"
                                value={formData.position}
                                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bodyType">Tipo de Cuerpo *</label>
                            <select
                                id="bodyType"
                                value={formData.bodyType}
                                onChange={(e) => setFormData(prev => ({ ...prev, bodyType: e.target.value }))}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Ectomorfo">Ectomorfo</option>
                                <option value="Mesomorfo">Mesomorfo</option>
                                <option value="Endomorfo">Endomorfo</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Physical Measurements */}
                <div className="form-section">
                    <h3>Medidas Físicas</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="height">Altura (cm) *</label>
                            <input
                                type="number"
                                id="height"
                                value={formData.height}
                                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                                step="0.1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="weight">Peso (kg) *</label>
                            <input
                                type="number"
                                id="weight"
                                value={formData.weight}
                                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                step="0.1"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="form-section">
                    <h3>Información de Contacto</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Teléfono</label>
                            <input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={saving}>
                        <IoSave />
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </PageTemplate>
    )
}

export default EditAthlete
