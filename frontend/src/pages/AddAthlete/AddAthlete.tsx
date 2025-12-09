import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    IoPersonAdd,
    IoPerson,
    IoFootball,
    IoBody,
    IoResize,
    IoScale,
    IoCalendar,
    IoMail,
    IoCall,
    IoGlobe
} from 'react-icons/io5'
import PageTemplate from '@/components/templates/PageTemplate'
import { ImageUpload } from '@/components/common/forms/ImageUpload'
import { Form } from '@/components/common/forms/Form'
import { useForm, useAthletes, useFormMessage } from '../../hooks'
import { CreateAthleteDTO } from '../../services/api'
import type { AthleteFormData } from '../../types/athlete.types'
import type { ValidationSchema } from '../../types/form.types'
import './AddAthlete.css'

// Initial form values
const initialValues: AthleteFormData = {
    name: '',
    gender: 'Male',
    birthDate: '',
    nationality: '',
    sport: '',
    club: '',
    position: '',
    bodyType: 'Mesomorph',
    height: '' as any, // Empty string for better UX
    weight: '' as any, // Empty string for better UX
    email: '',
    phone: ''
}

// Validation schema
const validationSchema: ValidationSchema<AthleteFormData> = {
    name: [
        {
            validate: (value) => value.trim().length > 0,
            message: 'El nombre es requerido'
        },
        {
            validate: (value) => value.trim().length >= 3,
            message: 'El nombre debe tener al menos 3 caracteres'
        }
    ],
    gender: [
        {
            validate: (value) => ['Male', 'Female', 'Other'].includes(value),
            message: 'El género es requerido'
        }
    ],
    sport: [
        {
            validate: (value) => value.trim().length > 0,
            message: 'El deporte es requerido'
        }
    ],
    bodyType: [
        {
            validate: (value) => ['Ectomorph', 'Mesomorph', 'Endomorph'].includes(value),
            message: 'El tipo de cuerpo es requerido'
        }
    ],
    height: [
        {
            validate: (value) => value > 0,
            message: 'La altura debe ser mayor a 0'
        },
        {
            validate: (value) => value >= 50 && value <= 250,
            message: 'La altura debe estar entre 50 y 250 cm'
        }
    ],
    weight: [
        {
            validate: (value) => value > 0,
            message: 'El peso debe ser mayor a 0'
        },
        {
            validate: (value) => value >= 20 && value <= 300,
            message: 'El peso debe estar entre 20 y 300 kg'
        }
    ],
    email: [
        {
            validate: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Formato de email inválido'
        }
    ]
}

function AddAthlete() {
    const navigate = useNavigate()
    const { createAthlete } = useAthletes()
    const { message, showMessage, clearMessage } = useFormMessage()
    const [photoFile, setPhotoFile] = useState<File | null>(null)

    // Form hook
    const form = useForm<AthleteFormData>({
        initialValues,
        validationSchema,
        onSubmit: handleFormSubmit
    })

    async function handleFormSubmit(values: AthleteFormData) {
        clearMessage()

        try {
            // Include photo in the athlete data
            const athleteData: CreateAthleteDTO = {
                ...values,
                photo: photoFile
            }

            const response = await createAthlete(athleteData)

            if (response?.success) {
                showMessage(
                    'success',
                    `✅ Athlete ${values.name} created successfully with code ${response.data.accessCode}`
                )

                // Reset form
                form.reset()
                setPhotoFile(null)

                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate('/dashboard')
                }, 2000)
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || error.message || 'Unknown error'
            showMessage('error', `❌ Error: ${errorMsg}`)
        }
    }

    const handleImageSelect = (file: File | null) => {
        setPhotoFile(file)
    }

    return (
        <PageTemplate
            title="Agregar Nuevo Atleta"
            subtitle="Completa la información del atleta para agregarlo a la base de datos"
            showBackButton={true}
            backTo="/dashboard"
            className="add-athlete-page"
            showNavbar={true}
            breadcrumbItems={[
                { label: 'Inicio', path: '/dashboard' },
                { label: 'Agregar Atleta' }
            ]}
        >
            <div className="add-athlete-container">
                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <Form
                    onSubmit={form.handleSubmit}
                    className="athlete-form"
                    values={form.values}
                    errors={form.errors}
                    touched={form.touched}
                    isSubmitting={form.isSubmitting}
                    handleChange={(field: string, value: any) => form.handleChange(field as keyof AthleteFormData, value)}
                    handleBlur={(field: string) => form.handleBlur(field as keyof AthleteFormData)}
                >
                    {/* Photo Upload */}
                    <ImageUpload
                        currentImage={null}
                        onImageSelect={handleImageSelect}
                        disabled={form.isSubmitting}
                    />

                    {/* Personal Information */}
                    <Form.Section title="Información Personal" icon={<IoPerson />}>
                        <Form.Row>
                            <Form.Field
                                name="name"
                                label="Nombre Completo"
                                placeholder="ej., Lionel Messi"
                                required
                            />
                            <Form.Field
                                name="gender"
                                label="Género"
                                type="select"
                                required
                                options={[
                                    { value: 'Male', label: 'Masculino' },
                                    { value: 'Female', label: 'Femenino' },
                                    { value: 'Other', label: 'Otro' }
                                ]}
                            />
                        </Form.Row>

                        <Form.Row>
                            <Form.Field
                                name="birthDate"
                                label="Fecha de Nacimiento"
                                type="date"
                                icon={<IoCalendar />}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            <Form.Field
                                name="nationality"
                                label="Nacionalidad"
                                placeholder="ej., Argentina"
                                icon={<IoGlobe />}
                            />
                        </Form.Row>
                    </Form.Section>

                    {/* Sports Information */}
                    <Form.Section title="Información Deportiva" icon={<IoFootball />}>
                        <Form.Row>
                            <Form.Field
                                name="sport"
                                label="Deporte"
                                placeholder="ej., Fútbol, Baloncesto, Atletismo"
                                required
                            />
                            <Form.Field
                                name="club"
                                label="Club/Equipo"
                                placeholder="ej., FC Barcelona"
                            />
                        </Form.Row>

                        <Form.Row>
                            <Form.Field
                                name="position"
                                label="Posición/Especialidad"
                                placeholder="ej., Delantero, Defensa"
                            />
                        </Form.Row>
                    </Form.Section>

                    {/* Physical Information */}
                    <Form.Section title="Información Física" icon={<IoBody />}>
                        <Form.Row>
                            <Form.Field
                                name="bodyType"
                                label="Tipo de Cuerpo"
                                type="select"
                                required
                                options={[
                                    { value: 'Ectomorph', label: 'Ectomorfo (Delgado)' },
                                    { value: 'Mesomorph', label: 'Mesomorfo (Atlético)' },
                                    { value: 'Endomorph', label: 'Endomorfo (Robusto)' }
                                ]}
                            />
                        </Form.Row>

                        <Form.Row>
                            <Form.Field
                                name="height"
                                label="Altura (cm)"
                                type="number"
                                placeholder="ej., 175"
                                required
                                icon={<IoResize />}
                            />
                            <Form.Field
                                name="weight"
                                label="Peso (kg)"
                                type="number"
                                placeholder="ej., 70"
                                required
                                icon={<IoScale />}
                            />
                        </Form.Row>
                    </Form.Section>

                    {/* Contact Information */}
                    <Form.Section title="Información de Contacto" icon={<IoMail />}>
                        <Form.Row>
                            <Form.Field
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="email@example.com"
                                icon={<IoMail />}
                            />
                            <Form.Field
                                name="phone"
                                label="Teléfono"
                                type="tel"
                                placeholder="+1 123 456 7890"
                                icon={<IoCall />}
                            />
                        </Form.Row>
                    </Form.Section>

                    {/* Actions */}
                    <Form.Actions>
                        <Form.SubmitButton
                            loadingText="Creando..."
                            icon={<IoPersonAdd />}
                        >
                            Crear Atleta
                        </Form.SubmitButton>
                    </Form.Actions>
                </Form>
            </div>
        </PageTemplate >
    )
}

export default AddAthlete
