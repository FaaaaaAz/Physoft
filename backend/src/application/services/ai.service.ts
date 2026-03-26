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
            throw new Error('La respuesta fue truncada por límite de tokens. Por favor, selecciona MENOS tipos de análisis (máximo 3-4) o reduce el número de imágenes.')
        }
        if (finishReason === 'SAFETY') {
            throw new Error('Contenido bloqueado por filtros de seguridad. Las imágenes pueden contener contenido inapropiado.')
        }
        if (finishReason === 'RECITATION') {
            throw new Error('Respuesta bloqueada por detección de contenido duplicado.')
        }

        const text = typeof response?.text === 'function' ? response.text() : ''
        if (!text || text.trim().length === 0) {
            throw new Error('La IA devolvió una respuesta vacía. Por favor, intenta de nuevo.')
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
            throw new Error('La IA devolvió una respuesta vacía. Por favor, intenta de nuevo.')
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
                throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno')
            }

            const modelName = process.env.OPENAI_MODEL || 'gpt-4.1-mini'
            this.provider = new OpenAIProvider(apiKey, modelName)
            console.log(`[AI] Provider initialized: openai (${modelName})`)
            return
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno')
        }

        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
        this.provider = new GeminiProvider(apiKey, modelName)
        console.log(`[AI] Provider initialized: gemini (${modelName})`)
    }

    /**
     * Analiza imágenes deportivas usando el proveedor de IA configurado
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
                throw new Error('Contenido bloqueado por filtros de seguridad del proveedor de IA. Verifica que las imágenes sean apropiadas.')
            }

            throw new Error(`Error al analizar imágenes con IA (${this.provider.providerName}): ${error.message}`)
        }
    }

    /**
     * Construye el prompt especializado según los tipos de análisis seleccionados
     */
    private buildPrompt(analysisTypes: AnalysisTypes): string {
    let prompt = `Responde ÚNICAMENTE con el JSON solicitado. Sin texto introductorio, sin explicaciones, sin markdown. El primer carácter de tu respuesta debe ser '{' y el último '}'.

Eres un kinesiólogo deportivo senior generando un reporte técnico clínico.

═══════════════════════════════════════════
PASO 1 — IDENTIFICACIÓN DEL TIPO DE EXAMEN
═══════════════════════════════════════════
Antes de cualquier análisis, identifica qué tipo de datos contienen las imágenes.
Clasifica en UNO de estos tipos:

- EMG: Señales electromiográficas de superficie (gráficos de onda, canales musculares)
- CINEMATICA: Ángulos articulares, rangos de movimiento, análisis postural (diagramas angulares, gráficos de ángulos vs tiempo)
- PELVIS: Datos de inclinación, oblicuidad y rotación pélvica (diales angulares, reportes de pelvis)
- FUERZA: Curvas de fuerza, plataforma de fuerza, dinamometría
- POSTURAL: Fotografías posturales o análisis de alineación corporal
- MARCHA: Análisis de ciclo de marcha, cadencia, parámetros espacio-temporales
- MIXTO: Combinación de dos o más tipos anteriores
- INVALIDO: Imagen sin contenido biomecánico/clínico relevante

SI el tipo es INVALIDO, responde EXACTAMENTE:
{"advertencia": "Las imágenes no contienen datos biomecánicos válidos. Se requieren gráficos EMG, análisis cinemáticos, fotografías posturales u otros datos clínicos relevantes."}

═══════════════════════════════════════════════════════
PASO 2 — VALORES NORMATIVOS SEGÚN TIPO DE EXAMEN
═══════════════════════════════════════════════════════
Usa estos rangos de referencia para clasificar estados. Aplica SOLO los relevantes al tipo identificado:

[EMG - ACTIVIDAD MUSCULAR]
- Fases de reposo: actividad mínima (~0) = OPTIMO
- Tono residual leve en reposo = ATENCION
- Tono residual persistente significativo = CRITICO
- Coordinación agonista/antagonista coherente = OPTIMO
- Cocontracción excesiva = ATENCION

[CINEMÁTICA PÉLVICA - en salto/marcha]
- Tilt rango: <45° = OPTIMO | 45-55° = ATENCION | >55° = CRITICO
- Obliquity rango: <10° = OPTIMO | 10-15° = ATENCION | >15° = CRITICO
- Rotation rango: <12° = OPTIMO | 12-20° = ATENCION | >20° = CRITICO

[CINEMÁTICA RODILLA - en salto/marcha]
- Flexión pico en landing: 45-90° = OPTIMO | <45° = ATENCION (rigidez) | >90° = ATENCION
- Valgo dinámico: <10° = OPTIMO | 10-20° = ATENCION | >20° = CRITICO

[CINEMÁTICA CADERA - en salto/marcha]
- Flexión funcional: 30-60° = OPTIMO | fuera de rango = ATENCION
- Rotación interna excesiva en carga: >15° = ATENCION

[ANÁLISIS POSTURAL]
- Desviación sagital/frontal <5° = OPTIMO
- Desviación 5-15° = ATENCION
- Desviación >15° = CRITICO

[FUERZA]
- Asimetría bilateral fuerza: <10% = OPTIMO | 10-15% = ATENCION | >15% = CRITICO
- Déficit de fuerza vs normativa por edad/deporte: <15% = OPTIMO | 15-25% = ATENCION | >25% = CRITICO

[MARCHA]
- Cadencia normal adulto: 100-120 pasos/min = OPTIMO
- Asimetría de paso: <5% = OPTIMO | 5-10% = ATENCION | >10% = CRITICO

REGLAS ABSOLUTAS:
1. Afirmaciones directas. NUNCA inicies con: "Sí", "No", "Hay".
2. NO expliques conceptos. Reporta hallazgos clínicos.
3. PROHIBIDO inventar datos no visibles en la imagen.
4. PROHIBIDO inventar porcentajes o magnitudes sin medición explícita.
5. Si no hay evidencia suficiente, usa estado "NO_EVALUABLE" con explicación.
6. La amplitud EMG normalizada NO es comparable entre músculos sin MVC. NUNCA afirmes dominancia lateral por amplitud visual.
7. Para cinemática: usa los valores normativos del PASO 2 para determinar el estado.
8. Escribe como médico en reporte clínico, no como chatbot.

JSON a generar:
{
"tipo_examen": "EMG | CINEMATICA | PELVIS | FUERZA | POSTURAL | MARCHA | MIXTO",`;

    // 1. FLEXIBILIDAD
    if (analysisTypes.flexibilidad) {
        prompt += `
        "flexibilidad": {
            "estado": "OPTIMO | ATENCION | CRITICO | NO_EVALUABLE",
            "hallazgos": "EMG → describe relajación muscular en valles y tono residual. CINEMATICA/PELVIS → describe rangos articulares con valores numéricos exactos encontrados. POSTURAL → describe alineación y desviaciones observadas. Siempre incluye los valores numéricos si están disponibles.",
            "interpretacion": "Contrasta los valores encontrados con los rangos normativos del PASO 2. Menciona explícitamente si el valor está dentro o fuera del rango normal.",
            "recomendacion": "Acción clínica concreta y específica."
        },`;
    }

    // 2. BIOBIT
    if (analysisTypes.biobit) {
        prompt += `
        "biobit": {
            "estado": "OPTIMO | ATENCION | CRITICO",
            "patron_temporal": "EMG → secuencia de activación muscular. CINEMATICA → describe el patrón de movimiento entre fases (ej: takeoff vs landing). MARCHA → describe el ciclo de movimiento.",
            "sincronizacion": "Evalúa coordinación entre segmentos, músculos o fases del movimiento según el tipo de examen.",
            "hallazgo_clave": "Hallazgo principal más relevante clínicamente."
        },`;
    }

    // 3. ASIMETRÍA
    if (analysisTypes.asimetria) {
        prompt += `
        "asimetria": {
            "estado": "OPTIMO | ATENCION | CRITICO | NO_EVALUABLE",
            "datos_disponibles": "Especifica qué datos bilaterales existen. Si no hay datos de ambos lados: 'No hay datos bilaterales suficientes para comparar lados.'",
            "comparacion": "Solo compara izquierdo vs derecho si existen datos explícitos de ambos lados.",
            "lado_dominante": "Oración completa. Ej: 'El lado derecho presenta mayor activación.' / 'El patrón es simétrico entre ambos lados.' / 'No es posible determinar dominancia sin datos bilaterales.'",
            "magnitud": "Oración completa con valor si existe. Ej: 'La diferencia es de aproximadamente 15%.' / 'La magnitud no es cuantificable sin métricas RMS o amplitud integrada; no es posible determinar significancia clínica.'",
            "relevancia": "Significancia clínica solo si la asimetría está demostrada con datos. Si no, indicar que no es concluible."
        },`;
    }

    // 4. CONTROL MOTOR
    if (analysisTypes.controlMotor) {
        prompt += `
        "control_motor": {
            "estado": "OPTIMO | ATENCION | CRITICO",
            "calidad_patron": "EMG → suavidad y consistencia de la señal. CINEMATICA → fluidez y consistencia del movimiento articular.",
            "estabilidad": "Evalúa estabilidad durante las fases de mayor demanda.",
            "fases_reposo": "EMG → actividad en reposo. CINEMATICA → comportamiento en fases de baja demanda o neutras.",
            "conclusion": "Resumen de la capacidad de control motor."
        },`;
    }

    // 5. FATIGA
    if (analysisTypes.fatiga) {
        prompt += `
        "fatiga": {
            "estado": "OPTIMO | ATENCION | CRITICO | NO_EVALUABLE",
            "evolucion_temporal": "Describe progresión de la señal a lo largo del tiempo. Si no hay progresión temporal demostrable: 'El registro no muestra progresión temporal suficiente para evaluar fatiga.'",
            "comparacion": "Compara inicio vs final SOLO si hay duración suficiente. Si no: 'No hay suficiente contexto temporal para comparar inicio y final.'",
            "signos": "Solo signos OBJETIVOS presentes: aumento progresivo de amplitud, disminución de frecuencia, degradación del patrón. Si no hay: 'No se observan signos objetivos de fatiga en el registro.'",
            "nivel": "Con evidencia objetiva clara: 'Sin fatiga evidente' | 'Fatiga moderada' | 'Fatiga significativa'. Sin evidencia: 'NO_EVALUABLE: requiere registro de esfuerzo sostenido.'"
        },`;
    }

    // 6. FUERZA E INERCIA
    if (analysisTypes.fuerzaInercia) {
        prompt += `
        "fuerza_inercia": {
            "estado": "OPTIMO | ATENCION | CRITICO | NO_EVALUABLE",
            "tipo_medicion": "Especifica exactamente qué datos están disponibles (EMG, fuerza, cinemática, velocidad, aceleración).",
            "generacion": "Con datos de fuerza/velocidad → analiza fase de generación explosiva. Con solo EMG o cinemática angular → 'No evaluable: se requieren datos de fuerza o velocidad.'",
            "control": "Con datos de fuerza/velocidad → analiza fase de frenado. Con solo EMG o cinemática → 'No evaluable: se requieren datos de fuerza o velocidad.'",
            "interpretacion": "Con datos suficientes → resume eficiencia mecánica. Sin datos suficientes → 'La eficiencia mecánica no es evaluable con los datos disponibles. Se requiere dinamometría o análisis cinemático completo.'"
        },`;
    }

    prompt += `
    INSTRUCCIONES PARA CONCLUSIONES:

    1. PUNTOS DÉBILES — REGLA FUNDAMENTAL:
       - [] es válido y correcto si todos los estados son OPTIMO.
       - Estados ATENCION → máximo 2 puntos débiles.
       - Estados CRITICO → máximo 4 puntos débiles.
       - NUNCA inventes problemas para completar la lista.
       - Específicos: "Rotación pélvica 19° supera rango normal (<12°)" NO "Problemas de rotación".
       - NO incluir secciones en NO_EVALUABLE como puntos débiles.
       - Prioridad: CRITICO > ATENCION.

    2. CAPACIDADES FÍSICAS (0-100):
       - Potencia: fuerza_inercia → generación explosiva
       - Resistencia: fatiga → capacidad de mantener esfuerzo
       - Fuerza: fuerza_inercia → generación de fuerza
       - Flexibilidad: flexibilidad → rangos/relajación
       - Velocidad: biobit + control_motor → rapidez de activación/movimiento
       - Mapeo: OPTIMO=75-95 | ATENCION=45-74 | CRITICO=15-44 | NO_EVALUABLE=50

    3. CLASIFICACIÓN COHORTE:
       - ELITE: 4-5 capacidades >75, sin CRITICO
       - AVANZADO: 3+ capacidades >65, máx 1 CRITICO
       - INTERMEDIO: 2+ capacidades >55, máx 2 CRITICO
       - PRINCIPIANTE: <2 capacidades >55
       - ATENCION_REQUERIDA: 2+ estados CRITICO o asimetrías severas

    "conclusiones": {
        "puntos_debiles": [
            {"area": "Área específica", "descripcion": "Descripción con valor numérico si aplica"}
        ],
        "capacidades_fisicas": {
            "potencia": 0,
            "resistencia": 0,
            "fuerza": 0,
            "flexibilidad": 0,
            "velocidad": 0
        },
        "clasificacion_cohorte": "ELITE | AVANZADO | INTERMEDIO | PRINCIPIANTE | ATENCION_REQUERIDA",
        "resumen_global": "1-2 frases ejecutivas integrando tipo de examen y hallazgos principales.",
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
