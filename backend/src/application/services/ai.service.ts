import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

interface AnalysisTypes {
    flexibilidad: boolean
    biobit: boolean
    asimetria: boolean
    controlMotor: boolean
    fatiga: boolean
    fuerzaInercia: boolean
}

interface AnalysisResults {
    // Análisis textuales
    flexibilityAnalysis?: string
    biobitAnalysis?: string
    muscularAsymmetry?: string
    activeMotorControl?: string
    functionalMuscleFatigue?: string
    inertiaForceControl?: string

    // Conclusiones
    weakPoints?: Array<{ area: string; descripcion: string }>
    physicalCapacities?: {
        potencia: number
        resistencia: number
        fuerza: number
        flexibilidad: number
        velocidad: number
    }
    cohortClassification?: string
}

type AIProviderName = 'gemini' | 'openai'

interface AIProvider {
    providerName: AIProviderName
    generateText(prompt: string, imageBuffers: Buffer[]): Promise<string>
}

class GeminiProvider implements AIProvider {
    providerName: AIProviderName = 'gemini'
    private genAI: GoogleGenerativeAI
    private model: any

    constructor(apiKey: string, modelName: string) {
        this.genAI = new GoogleGenerativeAI(apiKey)
        this.model = this.genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                maxOutputTokens: 8192,
                temperature: 0.7,
            }
        })
    }

    async generateText(prompt: string, imageBuffers: Buffer[]): Promise<string> {
        const imageParts = imageBuffers.map((buffer, index) => {
            const base64 = buffer.toString('base64')
            console.log(`Image ${index + 1}: Base64 length = ${base64.length} characters`)
            return {
                inlineData: {
                    data: base64,
                    mimeType: 'image/jpeg'
                }
            }
        })

        console.log('Calling Gemini API with', imageParts.length, 'images...')
        const result = await this.model.generateContent([prompt, ...imageParts])
        const response = await result.response
        console.log('Gemini API call completed')

        const finishReason = response.candidates?.[0]?.finishReason
        if (finishReason === 'MAX_TOKENS') {
            throw new Error('The response was truncated due to token limit. Please select FEWER types of analysis (maximum 3-4) or reduce the number of images.')
        }
        if (finishReason === 'SAFETY') {
            throw new Error('Content blocked by security filters. Images may contain inappropriate content.')
        }
        if (finishReason === 'RECITATION') {
            throw new Error('Response blocked by duplicate content detection.')
        }

        const text = typeof response?.text === 'function' ? response.text() : ''
        if (!text || text.trim().length === 0) {
            throw new Error('The AI returned an empty response. Please try again.')
        }

        return text
    }
}

class OpenAIProvider implements AIProvider {
    providerName: AIProviderName = 'openai'
    private client: OpenAI
    private modelName: string
    private requestTimeoutMs: number

    constructor(apiKey: string, modelName: string) {
        const timeoutFromEnv = Number(process.env.OPENAI_TIMEOUT_MS || 60000)
        this.requestTimeoutMs = Number.isFinite(timeoutFromEnv) && timeoutFromEnv > 0
            ? timeoutFromEnv
            : 60000

        this.client = new OpenAI({
            apiKey,
            timeout: this.requestTimeoutMs,
        })
        this.modelName = modelName
    }

    async generateText(prompt: string, imageBuffers: Buffer[]): Promise<string> {
        const content: any[] = [
            { type: 'text', text: prompt },
            ...imageBuffers.map((buffer) => ({
                type: 'image_url',
                image_url: {
                    url: `data:image/jpeg;base64,${buffer.toString('base64')}`
                }
            }))
        ]

        console.log('Calling OpenAI API with', imageBuffers.length, 'images...')
        const completion = await this.client.chat.completions.create({
            model: this.modelName,
            temperature: 0.7,
            max_tokens: 4096,
            messages: [
                {
                    role: 'user',
                    content
                }
            ]
        }, {
            timeout: this.requestTimeoutMs,
        })
        console.log('OpenAI API call completed')

        const rawContent: any = completion.choices?.[0]?.message?.content
        const text = Array.isArray(rawContent)
            ? rawContent
                .map((part: any) => typeof part === 'string' ? part : (part?.text || ''))
                .join('\n')
            : rawContent

        if (typeof text !== 'string' || text.trim().length === 0) {
            throw new Error('The AI returned an empty response. Please try again.')
        }

        return text
    }
}

class AIService {
    private provider: AIProvider

    constructor() {
        const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase()

        if (provider === 'openai') {
            const apiKey = process.env.OPENAI_API_KEY
            if (!apiKey) {
                throw new Error('OPENAI_API_KEY is not configured in the environment variables')
            }

            const modelName = process.env.OPENAI_MODEL || 'gpt-4.1-mini'
            this.provider = new OpenAIProvider(apiKey, modelName)
            console.log(`[AI] Provider initialized: openai (${modelName})`)
            return
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not configured in the environment variables')
        }

        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
        this.provider = new GeminiProvider(apiKey, modelName)
        console.log(`[AI] Provider initialized: gemini (${modelName})`)
    }

    /**
     * Analiza imágenes deportivas usando el proveedor de IA configurado.
     */
    async analyzeImages(
        imageBuffers: Buffer[],
        analysisTypes: AnalysisTypes
    ): Promise<AnalysisResults> {
        try {
            // LOG: Verify we received images
            console.log('=== AI SERVICE: ANALYZE IMAGES ===')
            console.log('Number of image buffers received:', imageBuffers.length)
            console.log('Buffer sizes:', imageBuffers.map(b => `${(b.length / 1024).toFixed(2)}KB`))
            console.log('Analysis types requested:', analysisTypes)

            if (!imageBuffers || imageBuffers.length === 0) {
                throw new Error('No image buffers provided to AI service')
            }

            // Construir el prompt basado en los tipos seleccionados
            const prompt = this.buildPrompt(analysisTypes)

            // Llamar al provider configurado
            const text = await this.provider.generateText(prompt, imageBuffers)

            // DEBUG: Log the raw response
            console.log('=== AI RAW RESPONSE ===')
            console.log(text)
            console.log('=== END RESPONSE ===')

            // Parsear la respuesta de la IA
            return this.parseAIResponse(text, analysisTypes)
        } catch (error: any) {
            console.error('Error en análisis de IA:', error)

            // Proporcionar mensaje de error más específico
            if (error.message.includes('SAFETY') || error.message.includes('blocked') || error.message.includes('seguridad')) {
                throw new Error('Content blocked by AI provider security filters. Check that the images are appropriate.')
            }

            throw new Error(`Error when analyzing images with AI (${this.provider.providerName}): ${error.message}`)
        }
    }

    /**
     * Construye el prompt especializado según los tipos de análisis seleccionados
     */
    private buildPrompt(analysisTypes: AnalysisTypes): string {
    let prompt = `Respond ONLY with the requested JSON. No introductory text, no explanations, no markdown formatting. The first character of your response must be '{' and the last must be '}'.

    You are a senior sports kinesiologist generating a clinical technical report.

    ═══════════════════════════════════════════
    STEP 1 — EXAM TYPE IDENTIFICATION
    ═══════════════════════════════════════════
    Before any analysis, identify what kind of data the images contain.
    Classify into ONE of these types:

    - EMG: Surface electromyography signals (waveforms, muscle channels)
    - CINEMATICA: Joint angles, range of motion, postural analysis
    - PELVIS: Pelvic tilt, obliquity, and rotation data
    - FUERZA: Force curves, force plates, dynamometry
    - POSTURAL: Postural photographs or body alignment analysis
    - MARCHA: Gait cycle analysis, cadence, spatiotemporal parameters
    - MIXTO: Combination of two or more of the above types
    - INVALIDO: Image without relevant biomechanical/clinical content

    IF the type is INVALIDO, respond EXACTLY with:
    {"advertencia": "The images do not contain valid biomechanical data. EMG graphs, kinematic analyses, postural photographs, or other relevant clinical data are required."}

    ═══════════════════════════════════════════════════════
    STEP 2 — NORMATIVE VALUES BY EXAM TYPE
    ═══════════════════════════════════════════════════════
    Use these reference ranges to classify statuses. Apply ONLY those relevant to the identified type:

    [EMG - MUSCLE ACTIVITY]
    - Resting phases: minimal activity (~0) = OPTIMAL
    - Mild residual tone at rest = WARNING
    - Significant persistent residual tone = CRITICAL
    - Coherent agonist/antagonist coordination = OPTIMAL
    - Excessive co-contraction = WARNING

    [PELVIC KINEMATICS - in jump/gait]
    - Tilt range: <45° = OPTIMAL | 45-55° = WARNING | >55° = CRITICAL
    - Obliquity range: <10° = OPTIMAL | 10-15° = WARNING | >15° = CRITICAL
    - Rotation range: <12° = OPTIMAL | 12-20° = WARNING | >20° = CRITICAL

    [KNEE KINEMATICS - in jump/gait]
    - Peak flexion on landing: 45-90° = OPTIMAL | <45° = WARNING (stiffness) | >90° = WARNING
    - Dynamic valgus: <10° = OPTIMAL | 10-20° = WARNING | >20° = CRITICAL

    [HIP KINEMATICS - in jump/gait]
    - Functional flexion: 30-60° = OPTIMAL | out of range = WARNING
    - Excessive internal rotation under load: >15° = WARNING

    [POSTURAL ANALYSIS]
    - Sagittal/frontal deviation <5° = OPTIMAL
    - Deviation 5-15° = WARNING
    - Deviation >15° = CRITICAL

    [FORCE]
    - Bilateral force asymmetry: <10% = OPTIMAL | 10-15% = WARNING | >15% = CRITICAL
    - Force deficit vs age/sport norm: <15% = OPTIMAL | 15-25% = WARNING | >25% = CRITICAL

    [GAIT]
    - Normal adult cadence: 100-120 steps/min = OPTIMAL
    - Step asymmetry: <5% = OPTIMAL | 5-10% = WARNING | >10% = CRITICAL

    ABSOLUTE RULES:
    1. Direct declarative statements. NEVER start with conversational words like: "Yes", "No", "There is", "There are".
    2. DO NOT explain concepts. Report clinical findings directly.
    3. FORBIDDEN to invent data not visible in the image.
    4. FORBIDDEN to invent percentages or magnitudes without explicit measurement.
    5. If there is insufficient evidence for a section, use the status "NOT_EVALUABLE".
    6. Normalized EMG amplitude is NOT comparable between muscles without MVC. NEVER assert lateral dominance based solely on visual amplitude.
    7. For kinematics: use the normative values from STEP 2 to determine the status.
    8. Write as a medical professional in a clinical report. The descriptive clinical text MUST be written in ENGLISH, even though the JSON keys are in Spanish.
    9. UX/UI DATA STRUCTURE RULE: If a section's "estado" is "NOT_EVALUABLE", you MUST set ALL its descriptive text fields strictly to null. NEVER write "Not evaluable", "No data", or any error messages inside the descriptive strings.

    JSON to generate:
    {
    "tipo_examen": "EMG | CINEMATICA | PELVIS | FUERZA | POSTURAL | MARCHA | MIXTO",`;

    // 1. FLEXIBILIDAD
    if (analysisTypes.flexibilidad) {
        prompt += `
        "flexibilidad": {
            "estado": "OPTIMAL | WARNING | CRITICAL | NOT_EVALUABLE",
            "hallazgos": "EMG → describe muscle relaxation and residual tone. KINEMATICS/PELVIS → describe joint ranges. POSTURAL → describe alignment. (null if NOT_EVALUABLE)",
            "interpretacion": "Contrast findings with normative ranges. (null if NOT_EVALUABLE)",
            "recomendacion": "Concrete clinical action. (null if NOT_EVALUABLE)"
        },`;
    }

    // 2. BIOBIT
    if (analysisTypes.biobit) {
        prompt += `
        "biobit": {
            "estado": "OPTIMAL | WARNING | CRITICAL | NOT_EVALUABLE",
            "patron_temporal": "EMG → muscle activation sequence. KINEMATICS/GAIT → movement cycle pattern. (null if NOT_EVALUABLE)",
            "sincronizacion": "Evaluate coordination between segments or muscles. (null if NOT_EVALUABLE)",
            "hallazgo_clave": "Main clinical finding. (null if NOT_EVALUABLE)"
        },`;
    }

    // 3. ASIMETRÍA
    if (analysisTypes.asimetria) {
        prompt += `
        "asimetria": {
            "estado": "OPTIMAL | WARNING | CRITICAL | NOT_EVALUABLE",
            "datos_disponibles": "Specify what bilateral data exists. (null if NOT_EVALUABLE)",
            "comparacion": "Compare left vs right. (null if NOT_EVALUABLE)",
            "lado_dominante": "Declare dominance. (null if NOT_EVALUABLE)",
            "magnitud": "Sentence with estimated value. (null if NOT_EVALUABLE)",
            "relevancia": "Clinical significance. (null if NOT_EVALUABLE)"
        },`;
    }

    // 4. CONTROL MOTOR
    if (analysisTypes.controlMotor) {
        prompt += `
        "control_motor": {
            "estado": "OPTIMAL | WARNING | CRITICAL | NOT_EVALUABLE",
            "calidad_patron": "Signal smoothness/consistency or movement fluidity. (null if NOT_EVALUABLE)",
            "estabilidad": "Evaluate stability during peak demand. (null if NOT_EVALUABLE)",
            "fases_reposo": "Behavior in resting or low-demand phases. (null if NOT_EVALUABLE)",
            "conclusion": "Summary of motor control capacity. (null if NOT_EVALUABLE)"
        },`;
    }

    // 5. FATIGA
    if (analysisTypes.fatiga) {
        prompt += `
        "fatiga": {
            "estado": "OPTIMAL | WARNING | CRITICAL | NOT_EVALUABLE",
            "evolucion_temporal": "Describe signal progression over time. (null if NOT_EVALUABLE)",
            "comparacion": "Compare start vs end. (null if NOT_EVALUABLE)",
            "signos": "Describe objective signs of fatigue. (null if NOT_EVALUABLE)",
            "nivel": "State 'No evident fatigue', 'Moderate fatigue', or 'Significant fatigue'. (null if NOT_EVALUABLE)"
        },`;
    }

    // 6. FUERZA E INERCIA
    if (analysisTypes.fuerzaInercia) {
        prompt += `
        "fuerza_inercia": {
            "estado": "OPTIMAL | WARNING | CRITICAL | NOT_EVALUABLE",
            "tipo_medicion": "Specify available data type. (null if NOT_EVALUABLE)",
            "generacion": "Analyze explosive generation phase. (null if NOT_EVALUABLE)",
            "control": "Analyze braking phase. (null if NOT_EVALUABLE)",
            "interpretacion": "Summarize mechanical efficiency. (null if NOT_EVALUABLE)"
        },`;
    }

    prompt += `
    INSTRUCTIONS FOR CONCLUSIONS:

    1. WEAK POINTS — FUNDAMENTAL RULE:
       - [] is valid and correct if all statuses are OPTIMAL.
       - WARNING statuses → maximum 2 weak points.
       - CRITICAL statuses → maximum 4 weak points.
       - NEVER invent problems just to populate the list.
       - Be specific: "Pelvic rotation 19° exceeds normal range" NOT "Rotation problems".
       - DO NOT include NOT_EVALUABLE sections as weak points.
       - Priority: CRITICAL > WARNING.

    2. PHYSICAL CAPACITIES (0-100):
       - potencia: fuerza_inercia → explosive generation
       - resistencia: fatiga → capacity to sustain effort
       - fuerza: fuerza_inercia → force generation
       - flexibilidad: flexibilidad → ranges/relaxation
       - velocidad: biobit + control_motor → speed of activation/movement
       - Mapping: OPTIMAL=75-95 | WARNING=45-74 | CRITICAL=15-44 | NOT_EVALUABLE=50

    3. COHORT CLASSIFICATION:
       - ELITE: 4-5 capacities >75, no CRITICAL
       - AVANZADO: 3+ capacities >65, max 1 CRITICAL
       - INTERMEDIO: 2+ capacities >55, max 2 CRITICAL
       - PRINCIPIANTE: <2 capacities >55
       - ATENCION_REQUERIDA: 2+ CRITICAL statuses or severe asymmetries

    "conclusiones": {
        "puntos_debiles": [
            {"area": "Specific area in English", "descripcion": "Description in English with numerical value if applicable"}
        ],
        "capacidades_fisicas": {
            "potencia": 0,
            "resistencia": 0,
            "fuerza": 0,
            "flexibilidad": 0,
            "velocidad": 0
        },
        "clasificacion_cohorte": "ELITE | AVANZADO | INTERMEDIO | PRINCIPIANTE | ATENCION_REQUERIDA",
        "resumen_global": "1-2 executive sentences in English integrating exam type and main findings.",
        "advertencia": null
    }
    }`;

    return prompt;
}
    /**
    * Parsea la respuesta de IA y extrae cada análisis
     */
    private parseAIResponse(text: string, analysisTypes: AnalysisTypes): AnalysisResults {
        const results: AnalysisResults = {}

        console.log('=== PARSING RESPONSE ===')
        console.log('Analysis types requested:', analysisTypes)

        // Intentar parsear como JSON primero (nuevo formato)
        try {
            // Limpiar el texto de posibles bloques de código markdown
            let cleanText = text.trim()
            if (cleanText.startsWith('```json')) {
                cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?$/g, '')
            } else if (cleanText.startsWith('```')) {
                cleanText = cleanText.replace(/```\n?/g, '')
            }

            const jsonResponse = JSON.parse(cleanText)
            console.log('✓ Parsed as JSON successfully')

            // CHECK FOR IMAGE VALIDATION WARNING FIRST
            if (jsonResponse.advertencia && !jsonResponse.flexibilidad && !jsonResponse.biobit &&
                !jsonResponse.asimetria && !jsonResponse.control_motor && !jsonResponse.fatiga &&
                !jsonResponse.fuerza_inercia) {
                console.log('⚠️ AI detected invalid images')
                throw new Error(jsonResponse.advertencia)
            }

            // Mapear campos del JSON a los resultados
            if (analysisTypes.flexibilidad && jsonResponse.flexibilidad) {
                const flex = jsonResponse.flexibilidad
                const parts = [
                    flex.hallazgos,
                    flex.interpretacion,
                    flex.recomendacion
                ].filter(Boolean)
                results.flexibilityAnalysis = parts.join(' ').trim()
                console.log('✓ Flexibilidad mapped from JSON')
            }

            if (analysisTypes.biobit && jsonResponse.biobit) {
                const biobit = jsonResponse.biobit
                const parts = [
                    biobit.patron_temporal,
                    biobit.sincronizacion,
                    biobit.hallazgo_clave
                ].filter(Boolean)
                results.biobitAnalysis = parts.join(' ').trim()
                console.log('✓ Biobit mapped from JSON')
            }

            if (analysisTypes.asimetria && jsonResponse.asimetria) {
                const asim = jsonResponse.asimetria
                const parts = [
                    asim.datos_disponibles,
                    asim.comparacion,
                    asim.lado_dominante,
                    asim.magnitud,
                    asim.relevancia
                ].filter(Boolean)
                results.muscularAsymmetry = parts.join(' ').trim()
                console.log('✓ Asimetria mapped from JSON')
            }

            if (analysisTypes.controlMotor && jsonResponse.control_motor) {
                const control = jsonResponse.control_motor
                const parts = [
                    control.calidad_patron,
                    control.estabilidad,
                    control.fases_reposo,
                    control.conclusion
                ].filter(Boolean)
                results.activeMotorControl = parts.join(' ').trim()
                console.log('✓ Control Motor mapped from JSON')
            }

            if (analysisTypes.fatiga && jsonResponse.fatiga) {
                const fatiga = jsonResponse.fatiga
                const parts = [
                    fatiga.evolucion_temporal,
                    fatiga.comparacion,
                    fatiga.signos,
                    fatiga.nivel
                ].filter(Boolean)
                results.functionalMuscleFatigue = parts.join(' ').trim()
                console.log('✓ Fatiga mapped from JSON')
            }

            if (analysisTypes.fuerzaInercia && jsonResponse.fuerza_inercia) {
                const fuerza = jsonResponse.fuerza_inercia
                const parts = [
                    fuerza.tipo_medicion,
                    fuerza.generacion,
                    fuerza.control,
                    fuerza.interpretacion
                ].filter(Boolean)
                results.inertiaForceControl = parts.join(' ').trim()
                console.log('✓ Fuerza Inercia mapped from JSON')
            }

            // Mapear conclusiones
            if (jsonResponse.conclusiones) {
                const conclusiones = jsonResponse.conclusiones

                // Puntos débiles
                if (conclusiones.puntos_debiles && Array.isArray(conclusiones.puntos_debiles)) {
                    results.weakPoints = conclusiones.puntos_debiles
                    console.log('✓ Puntos débiles mapped from JSON:', results.weakPoints?.length, 'items')
                }

                // Capacidades físicas
                if (conclusiones.capacidades_fisicas) {
                    results.physicalCapacities = {
                        potencia: conclusiones.capacidades_fisicas.potencia || 0,
                        resistencia: conclusiones.capacidades_fisicas.resistencia || 0,
                        fuerza: conclusiones.capacidades_fisicas.fuerza || 0,
                        flexibilidad: conclusiones.capacidades_fisicas.flexibilidad || 0,
                        velocidad: conclusiones.capacidades_fisicas.velocidad || 0
                    }
                    console.log('✓ Capacidades físicas mapped from JSON')
                }

                // Clasificación cohorte
                if (conclusiones.clasificacion_cohorte) {
                    results.cohortClassification = conclusiones.clasificacion_cohorte
                    console.log('✓ Clasificación cohorte mapped from JSON:', results.cohortClassification)
                }
            }

            const evidenceType = String(jsonResponse?.meta?.tipo_evidencia_detectada || '').toUpperCase()
            const isKinematicEvidence = evidenceType.includes('CINEMATICA') || evidenceType === 'MIXTA'

            const rotationTextSources = [
                jsonResponse?.flexibilidad?.hallazgos,
                jsonResponse?.flexibilidad?.interpretacion,
                jsonResponse?.control_motor?.calidad_patron,
                jsonResponse?.control_motor?.conclusion,
                jsonResponse?.biobit?.hallazgo_clave,
                results.flexibilityAnalysis,
                results.activeMotorControl,
                results.biobitAnalysis,
            ].filter(Boolean).join(' ')

            const rotationPatterns = [
                /rango[^.\n]{0,60}rotaci[oó]n[^0-9]{0,12}(\d+(?:[.,]\d+)?)\s*°/gi,
                /rotaci[oó]n[^.\n]{0,60}rango[^0-9]{0,12}(\d+(?:[.,]\d+)?)\s*°/gi,
                /range[^.\n]{0,60}rotation[^0-9]{0,12}(\d+(?:[.,]\d+)?)\s*°/gi,
                /rotation[^.\n]{0,60}range[^0-9]{0,12}(\d+(?:[.,]\d+)?)\s*°/gi,
                /rotaci[oó]n[^0-9]{0,12}(\d+(?:[.,]\d+)?)\s*°/gi,
                /rotation[^0-9]{0,12}(\d+(?:[.,]\d+)?)\s*°/gi,
            ]

            const rotationValues: number[] = []
            for (const pattern of rotationPatterns) {
                pattern.lastIndex = 0
                let match = pattern.exec(rotationTextSources)
                while (match) {
                    const value = Number(match[1].replace(',', '.'))
                    if (Number.isFinite(value)) {
                        rotationValues.push(value)
                    }
                    match = pattern.exec(rotationTextSources)
                }
            }

            const maxRotation = rotationValues.length > 0 ? Math.max(...rotationValues) : null
            if (isKinematicEvidence && maxRotation !== null && maxRotation >= 12) {
                if (!results.weakPoints) {
                    results.weakPoints = []
                }

                const hasRotationWeakPoint = results.weakPoints.some((point) => {
                    const area = String(point?.area || '').toLowerCase()
                    const descripcion = String(point?.descripcion || '').toLowerCase()
                    return area.includes('rot') || descripcion.includes('rot') || area.includes('pelv') || descripcion.includes('pelv')
                })

                if (!hasRotationWeakPoint) {
                    const estado = maxRotation > 20 ? 'CRITICO' : 'ATENCION'
                    results.weakPoints.push({
                        area: 'Control rotatorio pélvico',
                        descripcion: `Rango de rotación pélvica elevado (${maxRotation}°), compatible con compensación rotatoria en el gesto y requerimiento de control lumbopélvico (${estado}).`
                    })
                    console.log('✓ Weak point fallback added for elevated pelvic rotation:', maxRotation)
                }

                if (!results.cohortClassification || results.cohortClassification === 'ELITE') {
                    results.cohortClassification = maxRotation > 20 ? 'ATENCION_REQUERIDA' : 'INTERMEDIO'
                    console.log('✓ Cohort classification adjusted by pelvic rotation fallback:', results.cohortClassification)
                }
            }

        } catch (jsonError: any) {
            // If it's a validation error (invalid images), re-throw it
            if (jsonError.message && jsonError.message.includes('imágenes proporcionadas no contienen datos biomecánicos')) {
                throw jsonError
            }

            console.log('⚠ Not JSON format, trying text format...')

            // Fallback: Intentar extraer cada sección usando regex (formato antiguo)
            if (analysisTypes.flexibilidad) {
                const flexMatch = text.match(/FLEXIBILIDAD:\s*(.+?)(?=\n(?:BIOBIT|ASIMETRIA|CONTROL_MOTOR|FATIGA|FUERZA_INERCIA):|$)/s)
                if (flexMatch) {
                    results.flexibilityAnalysis = flexMatch[1].trim()
                    console.log('✓ Flexibilidad parsed from text')
                } else {
                    console.log('✗ Flexibilidad not found')
                }
            }

            if (analysisTypes.biobit) {
                const biobitMatch = text.match(/BIOBIT:\s*(.+?)(?=\n(?:ASIMETRIA|CONTROL_MOTOR|FATIGA|FUERZA_INERCIA):|$)/s)
                if (biobitMatch) {
                    results.biobitAnalysis = biobitMatch[1].trim()
                    console.log('✓ Biobit parsed from text')
                } else {
                    console.log('✗ Biobit not found')
                }
            }

            if (analysisTypes.asimetria) {
                const asimetriaMatch = text.match(/ASIMETRIA:\s*(.+?)(?=\n(?:CONTROL_MOTOR|FATIGA|FUERZA_INERCIA):|$)/s)
                if (asimetriaMatch) {
                    results.muscularAsymmetry = asimetriaMatch[1].trim()
                    console.log('✓ Asimetria parsed from text')
                } else {
                    console.log('✗ Asimetria not found')
                }
            }

            if (analysisTypes.controlMotor) {
                const controlMatch = text.match(/CONTROL_MOTOR:\s*(.+?)(?=\n(?:FATIGA|FUERZA_INERCIA):|$)/s)
                if (controlMatch) {
                    results.activeMotorControl = controlMatch[1].trim()
                    console.log('✓ Control Motor parsed from text')
                } else {
                    console.log('✗ Control Motor not found')
                }
            }

            if (analysisTypes.fatiga) {
                const fatigaMatch = text.match(/FATIGA:\s*(.+?)(?=\n(?:FUERZA_INERCIA):|$)/s)
                if (fatigaMatch) {
                    results.functionalMuscleFatigue = fatigaMatch[1].trim()
                    console.log('✓ Fatiga parsed from text')
                } else {
                    console.log('✗ Fatiga not found')
                }
            }

            if (analysisTypes.fuerzaInercia) {
                const fuerzaMatch = text.match(/FUERZA_INERCIA:\s*(.+?)$/s)
                if (fuerzaMatch) {
                    results.inertiaForceControl = fuerzaMatch[1].trim()
                    console.log('✓ Fuerza Inercia parsed from text')
                } else {
                    console.log('✗ Fuerza Inercia not found')
                }
            }
        }

        console.log('=== PARSED RESULTS ===')
        console.log(JSON.stringify(results, null, 2))

        return results
    }
}

export default new AIService()
