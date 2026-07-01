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
import { useForm, useFormMessage } from '../../hooks'
import { CreateAthleteDTO, athleteAPI } from '../../services/api'
import { useAthleteStore } from '@/store/athleteStore'
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
    patientType: 'Athlete',
    height: undefined as any,
    weight: undefined as any,
    email: '',
    phone: ''
}

// Validation schema
const validationSchema: ValidationSchema<AthleteFormData> = {
    name: [
        {
            validate: (value) => value.trim().length > 0,
            message: 'Name is required'
        },
        {
            validate: (value) => value.trim().length >= 3,
            message: 'Name must be at least 3 characters'
        }
    ],
    gender: [
        {
            validate: (value) => ['Male', 'Female', 'Other'].includes(value),
            message: 'Gender is required'
        }
    ],
    patientType: [
        {
            validate: (value) => ['Athlete', 'General Patient'].includes(value),
            message: 'Patient type is required'
        }
    ],
    sport: [
        {
            validate: (value) => value.trim().length > 0,
            message: 'Sport is required'
        }
    ],
    bodyType: [
        {
            validate: (value) => ['Ectomorph', 'Mesomorph', 'Endomorph'].includes(value),
            message: 'Body type is required'
        }
    ],
    height: [
        {
            validate: (value) => value !== undefined && value !== null && String(value).trim() !== '' && !isNaN(Number(value)),
            message: 'Height is required'
        },
        {
            validate: (value) => {
                const num = Number(value)
                return num > 0
            },
            message: 'Height must be greater than 0'
        },
        {
            validate: (value) => {
                const num = Number(value)
                return num >= 50 && num <= 250
            },
            message: 'Height must be between 50 and 250 cm'
        }
    ],
    weight: [
        {
            validate: (value) => value !== undefined && value !== null && String(value).trim() !== '' && !isNaN(Number(value)),
            message: 'Weight is required'
        },
        {
            validate: (value) => {
                const num = Number(value)
                return num > 0
            },
            message: 'Weight must be greater than 0'
        },
        {
            validate: (value) => {
                const num = Number(value)
                return num >= 20 && num <= 300
            },
            message: 'Weight must be between 20 and 300 kg'
        }
    ],
    email: [
        {
            validate: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Invalid email format'
        }
    ]
}

function AddAthlete() {
    const navigate = useNavigate()
    const { addAthlete } = useAthleteStore()
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

            // Create athlete via API
            const response = await athleteAPI.create(athleteData)

            if (response?.success) {
                // Update store with new athlete
                addAthlete(response.data)

                showMessage(
                        'success',
                        `✅ Patient ${values.name} created successfully with code ${response.data.accessCode}`
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
            title="Add New Patient"
            subtitle="Fill out the patient information to add them to the database"
            showBackButton={true}
            className="add-athlete-page"
            showNavbar={true}
            breadcrumbItems={[
                { label: 'Home', path: '/dashboard' },
                { label: 'Add Patient' }
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
                    <Form.Section title="Personal Information" icon={<IoPerson />}>
                        <Form.Row>
                            <Form.Field
                                name="name"
                                label="Full Name"
                                placeholder="e.g., Lionel Messi"
                                required
                            />
                            <Form.Field
                                name="gender"
                                label="Gender"
                                type="select"
                                required
                                options={[
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Other', label: 'Other' }
                                ]}
                            />
                            <Form.Field
                                name="patientType"
                                label="Patient Type"
                                type="select"
                                required
                                options={[
                                    { value: 'Athlete', label: 'Athlete' },
                                    { value: 'General Patient', label: 'General Patient' }
                                ]}
                            />
                        </Form.Row>

                        <Form.Row>
                            <Form.Field
                                    name="birthDate"
                                    label="Birth Date"
                                    type="date"
                                    icon={<IoCalendar />}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            <Form.Field
                                    name="nationality"
                                    label="Nationality"
                                    placeholder="e.g., Argentina"
                                    icon={<IoGlobe />}
                            />
                        </Form.Row>
                    </Form.Section>

                    {/* Sports Information */}
                    <Form.Section title="Sport Information" icon={<IoFootball />}>
                        <Form.Row>
                            <Form.Field
                                name="sport"
                                label="Sport"
                                placeholder="e.g., Soccer, Basketball, Track"
                                required
                            />
                            <Form.Field
                                name="club"
                                label="Club/Team"
                                placeholder="e.g., FC Barcelona"
                            />
                        </Form.Row>

                        <Form.Row>
                            <Form.Field
                                name="position"
                                label="Position/Specialty"
                                placeholder="e.g., Forward, Defender"
                            />
                        </Form.Row>
                    </Form.Section>

                    {/* Physical Information */}
                    <Form.Section title="Physical Information" icon={<IoBody />}>
                        <Form.Row>
                            <Form.Field
                                name="bodyType"
                                label="Body Type"
                                type="select"
                                required
                                options={[
                                    { value: 'Ectomorph', label: 'Ectomorph (Lean)' },
                                    { value: 'Mesomorph', label: 'Mesomorph (Athletic)' },
                                    { value: 'Endomorph', label: 'Endomorph (Robust)' }
                                ]}
                            />
                        </Form.Row>

                        <Form.Row>
                            <Form.Field
                                name="height"
                                label="Height (cm)"
                                type="number"
                                placeholder="e.g., 175"
                                required
                                icon={<IoResize />}
                            />
                            <Form.Field
                                name="weight"
                                label="Weight (kg)"
                                type="number"
                                placeholder="e.g., 70"
                                required
                                icon={<IoScale />}
                            />
                        </Form.Row>
                    </Form.Section>

                    {/* Contact Information */}
                    <Form.Section title="Contact Information" icon={<IoMail />}>
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
                                label="Phone"
                                type="tel"
                                placeholder="+1 123 456 7890"
                                icon={<IoCall />}
                            />
                        </Form.Row>
                    </Form.Section>

                    {/* Actions */}
                    <Form.Actions>
                        <Form.SubmitButton
                            loadingText="Creating..."
                            icon={<IoPersonAdd />}
                        >
                            Create Patient
                        </Form.SubmitButton>
                    </Form.Actions>
                </Form>
            </div>
        </PageTemplate >
    )
}

export default AddAthlete
