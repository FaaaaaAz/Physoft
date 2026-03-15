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

Eres un kinesiólogo deportivo generando un reporte técnico.

🚨 VALIDACIÓN CRÍTICA DE IMÁGENES - LEE ESTO PRIMERO:

1. ANTES de analizar, verifica si las imágenes contienen datos biomecánicos REALES
2. Imágenes VÁLIDAS incluyen:
   - Gráficos EMG (electromiografía) con señales musculares
   - Fotografías posturales de atletas
   - Análisis de movimiento deportivo
   - Datos de fuerza, ángulos articulares, o mediciones biomecánicas
   - Análisis de fisioterapia en general
   - Otros análisis y imágenes relevantes

3. Imágenes INVÁLIDAS incluyen:
   - Memes, capturas de pantalla aleatorias
   - Fotos sin contenido deportivo/médico
   - Imágenes de texto sin datos
   - Cualquier contenido NO relacionado con análisis biomecánico

4. SI LAS IMÁGENES NO SON VÁLIDAS, responde EXACTAMENTE con este JSON:
   {
     "advertencia": "Las imágenes proporcionadas no contienen datos biomecánicos válidos para análisis. Se requieren gráficos EMG, fotografías posturales o datos de movimiento deportivo. Por favor, sube imágenes relevantes."
   }

5. ⚠️ NUNCA INVENTES DATOS si las imágenes no son relevantes
6. ⚠️ NUNCA generes análisis basado en imaginación
7. ⚠️ Si tienes CUALQUIER duda sobre la validez, usa la respuesta de advertencia

REGLAS ABSOLUTAS (solo si imágenes son válidas):
1. Escribe SOLO afirmaciones directas. NUNCA uses: "Sí", "No", "Hay", como inicio de frase.
2. NUNCA escribas palabras sueltas como "GRÁFICO" o "EMG" al inicio. Integra en la frase.
3. Ejemplo PROHIBIDO: "Sí, se dispone de datos..." → CORRECTO: "Los datos bilaterales muestran..."
4. Ejemplo PROHIBIDO: "GRÁFICO Se observan..." → CORRECTO: "El gráfico EMG muestra..."
5. NO expliques conceptos. Reporta hallazgos.
6. JSON válido sin markdown.
7. PROHIBIDO inventar lateralidad bilateral (izquierdo vs derecho) si no hay canales/mediciones de ambos lados.
8. PROHIBIDO inventar porcentajes o magnitudes si no existe medición explícita.
9. Si no hay evidencia suficiente para una sección, usa "NO_EVALUABLE" y explica limitación.
10. AMPLITUD EMG: La amplitud de la señal EMG de superficie está normalizada y NO es directamente comparable entre músculos ni entre lados sin normalización MVC explícita. NUNCA afirmes dominancia lateral basándote solo en amplitud visual.

JSON a generar:
    {`;

        // 1. FLEXIBILIDAD
        if (analysisTypes.flexibilidad) {
            prompt += `
            "flexibilidad": {
                "estado": "OPTIMO | ATENCION | CRITICO | NO_EVALUABLE",
                "hallazgos": "Si la evidencia es EMG: describe EXCLUSIVAMENTE la capacidad de relajación muscular en los valles de la señal y la persistencia de actividad entre activaciones. Si la evidencia es fotografía postural: describe amplitudes articulares observadas. NUNCA digas que falta una foto si ya hay un gráfico EMG válido.",
                "interpretacion": "En EMG: evalúa tono residual o capacidad de relajación muscular. En fotografía: evalúa rigidez articular o restricción de rango. Si no existe evidencia suficiente para ninguna de las dos, usa NO_EVALUABLE.",
                "recomendacion": "Acción concreta."
            },`;
        }

        // 2. BIOBIT
        if (analysisTypes.biobit) {
            prompt += `
            "biobit": {
                "estado": "OPTIMO | ATENCION | CRITICO",
                "patron_temporal": "Describe secuencia de activación muscular observada.",
                "sincronizacion": "Evalúa coordinación entre músculos/lados.",
                "hallazgo_clave": "Destaca hallazgo principal."
            },`;
        }

        // 3. ASIMETRÍA
        if (analysisTypes.asimetria) {
            prompt += `
            "asimetria": {
                "estado": "OPTIMO | ATENCION | CRITICO | NO_EVALUABLE",
                "datos_disponibles": "Si hay bilateral real: 'Los datos bilaterales muestran...'. Si NO hay bilateral: 'No hay datos bilaterales suficientes para comparar lados'.",
                "comparacion": "Solo comparar izquierdo vs derecho si existen datos de ambos lados. Si no, indicar limitación.",
                "lado_dominante": "Escribe SIEMPRE una oración completa. Ejemplos: 'El lado derecho presenta mayor activación.' / 'El patrón es simétrico entre ambos lados.' / 'No es posible determinar dominancia sin datos bilaterales.' NUNCA escribas solo 'Lado derecho' o 'Lado izquierdo' solos.",
                "magnitud": "Escribe SIEMPRE una oración completa. Ejemplos: 'La diferencia estimada es de aproximadamente un 15%.' / 'La magnitud de la asimetría no es cuantificable con los datos disponibles.' NUNCA escribas solo 'No cuantificable'.",
                "relevancia": "Evalúa significancia clínica solo cuando la asimetría esté demostrada. Si no, explicar que no es concluible."
            },`;
        }

        // 4. CONTROL MOTOR
        if (analysisTypes.controlMotor) {
            prompt += `
            "control_motor": {
                "estado": "OPTIMO | ATENCION | CRITICO",
                "calidad_patron": "Describe suavidad y consistencia del patrón.",
                "estabilidad": "Evalúa estabilidad de señal.",
                "fases_reposo": "Describe comportamiento en descanso.",
                "conclusion": "Resume capacidad de control motor."
            },`;
        }

        // 5. FATIGA
        if (analysisTypes.fatiga) {
            prompt += `
            "fatiga": {
                "estado": "OPTIMO | ATENCION | CRITICO | NO_EVALUABLE",
                "evolucion_temporal": "Describe el comportamiento de la señal a lo largo del tiempo. Si la señal es estática o no muestra progresión temporal demostrable, escribe: 'El registro no muestra una progresión temporal suficiente para evaluar fatiga.'.",
                "comparacion": "Compara el inicio vs el final del registro SOLO si hay duración suficiente. Para diagnosticar fatiga se requiere degradación progresiva y sostenida (aumento de amplitud + disminución de frecuencia, o densidad creciente a lo largo del tiempo). Si el registro es corto o estático, escribe: 'No hay suficiente contexto temporal para comparar inicio y final.'.",
                "signos": "Lista únicamente signos OBJETIVOS de fatiga presentes en la señal: incremento progresivo de amplitud, disminución progresiva de frecuencia, aumento de densidad hacia el final. Si no se observan estos signos claramente, escribe: 'No se observan signos objetivos de fatiga en el registro.'.",
                "nivel": "SOLO si hay evidencia temporal objetiva clara: 'Sin fatiga evidente' o 'Fatiga moderada' o 'Fatiga significativa'. Si la evidencia es insuficiente o el registro no es temporal, usa: 'NO_EVALUABLE: requiere registro de esfuerzo sostenido'."
            },`;
        }

        // 6. FUERZA E INERCIA
        if (analysisTypes.fuerzaInercia) {
            prompt += `
            "fuerza_inercia": {
                "estado": "OPTIMO | ATENCION | CRITICO | NO_EVALUABLE",
                "tipo_medicion": "Especifica QUÉ datos están disponibles: 'La señal EMG muestra...' y si hay o no datos de fuerza, velocidad, aceleración o cinemática articular.",
                "generacion": "ADVERTENCIA CRÍTICA: La generación de fuerza y explosividad SOLO puede evaluarse con datos de fuerza (dinamómetro, plataforma de fuerza) o velocidad/aceleración. El EMG de superficie NO mide fuerza directamente. Si SOLO hay EMG, escribe: 'No evaluable con EMG únicamente: se requieren datos de fuerza o cinemática.' Si hay datos de fuerza o velocidad, analiza la pendiente de subida.",
                "control": "ADVERTENCIA CRÍTICA: La fase de frenado y control inercial SOLO puede evaluarse con datos de fuerza o cinemática. Si SOLO hay EMG, escribe: 'No evaluable con EMG únicamente: se requieren datos de fuerza o cinemática.' Si hay datos complementarios, analiza la pendiente de bajada.",
                "interpretacion": "Si solo hay EMG disponible: 'La eficiencia mecánica y el control de fuerza no son evaluables a partir de EMG de superficie únicamente. Se requiere dinamometría o análisis cinemático para esta valoración.' Solo si hay datos de fuerza/cinemática: resume eficiencia mecánica."
            },`;
        }

        // CONCLUSIONES - Basadas en TODOS los análisis anteriores
        prompt += `
        INSTRUCCIONES PARA CONCLUSIONES (aplica al bloque conclusiones a continuación):

        1. PUNTOS DÉBILES — REGLA FUNDAMENTAL: Solo reporta problemas que REALMENTE existen.
           - "puntos_debiles": [] es una respuesta VÁLIDA y CORRECTA si todos los estados son OPTIMO.
           - Si hay estados ATENCION: máximo 2 puntos débiles.
           - Si hay estados CRITICO: máximo 4 puntos débiles.
           - NUNCA inventes o exageres problemas para "completar" la lista.
           - Identifica áreas problemáticas ESPECÍFICAS basadas en estados CRITICO y ATENCION.
           - Ejemplo BUENO: "Tono residual en cuádriceps durante fases de reposo"
           - Ejemplo MALO: "Problemas musculares generales"
           - Prioriza: CRITICO > ATENCION
           - NO incluir asimetría bilateral si la sección asimetria está en NO_EVALUABLE.
           - NO incluir fatiga si su estado es NO_EVALUABLE.
           - NO incluir fuerza/inercia si su estado es NO_EVALUABLE.

        2. CAPACIDADES FÍSICAS (scores 0-100):
           - Potencia: Basado en fuerza_inercia (generación explosiva)
           - Resistencia: Basado en fatiga (capacidad de mantener esfuerzo)
           - Fuerza: Basado en fuerza_inercia (generación de fuerza)
           - Flexibilidad: Basado en flexibilidad (rangos de movimiento/relajación)
           - Velocidad: Basado en biobit y control_motor (rapidez de activación)
           Mapeo de estados a scores: OPTIMO → 75-95, ATENCION → 45-74, CRITICO → 15-44, NO_EVALUABLE → 50 (neutro).

        3. CLASIFICACIÓN COHORTE:
           - ELITE: 4-5 capacidades >75, sin puntos críticos
           - AVANZADO: 3+ capacidades >65, máx 1 punto crítico
           - INTERMEDIO: 2+ capacidades >55, máx 2 puntos críticos
           - PRINCIPIANTE: <2 capacidades >55
           - ATENCION_REQUERIDA: 2+ puntos críticos o múltiples asimetrías severas

        4. resumen_global: 1-2 frases ejecutivas integrando todos los hallazgos.
        5. advertencia: null salvo que haya un problema crítico que requiera derivación urgente.

        RECUERDA: Escribe como médico en reporte, NO como chatbot. Integra todo en frases completas.

        "conclusiones": {
            "puntos_debiles": [
                {
                    "area": "Nombre específico del área problemática",
                    "descripcion": "Descripción concreta del problema detectado"
                }
            ],
            "capacidades_fisicas": {
                "potencia": 0-100,
                "resistencia": 0-100,
                "fuerza": 0-100,
                "flexibilidad": 0-100,
                "velocidad": 0-100
            },
            "clasificacion_cohorte": "ELITE | AVANZADO | INTERMEDIO | PRINCIPIANTE | ATENCION_REQUERIDA",
            "resumen_global": "Resumen ejecutivo en 1-2 frases completas.",
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
