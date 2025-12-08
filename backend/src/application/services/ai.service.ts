import { GoogleGenerativeAI } from '@google/generative-ai'

interface AnalysisTypes {
    flexibilidad: boolean
    biobit: boolean
    asimetria: boolean
    controlMotor: boolean
    fatiga: boolean
    fuerzaInercia: boolean
}

interface AnalysisResults {
    flexibilityAnalysis?: string
    biobitAnalysis?: string
    muscularAsymmetry?: string
    activeMotorControl?: string
    functionalMuscleFatigue?: string
    inertiaForceControl?: string
}

class AIService {
    private genAI: GoogleGenerativeAI
    private model: any

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno')
        }

        this.genAI = new GoogleGenerativeAI(apiKey)
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
        this.model = this.genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                maxOutputTokens: 8192, // Máximo del modelo para respuestas completas
                temperature: 0.7, // Balance entre creatividad y precisión
            }
        })
    }

    /**
     * Analiza imágenes deportivas usando Gemini AI
     */
    async analyzeImages(
        imageBuffers: Buffer[],
        analysisTypes: AnalysisTypes
    ): Promise<AnalysisResults> {
        try {
            // Convertir buffers a base64 para Gemini
            const imageParts = imageBuffers.map(buffer => ({
                inlineData: {
                    data: buffer.toString('base64'),
                    mimeType: 'image/jpeg'
                }
            }))

            // Construir el prompt basado en los tipos seleccionados
            const prompt = this.buildPrompt(analysisTypes)

            // Llamar a Gemini con las imágenes y el prompt
            const result = await this.model.generateContent([prompt, ...imageParts])
            const response = await result.response

            // DEBUG: Log response structure
            console.log('=== RESPONSE DEBUG ===')
            console.log('Candidates:', response.candidates?.length)
            console.log('Finish reason:', response.candidates?.[0]?.finishReason)
            console.log('=== END DEBUG ===')

            // Verificar finish reason ANTES de intentar obtener el texto
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

            // Verificar si la respuesta fue bloqueada por safety filters
            if (!response || !response.text) {
                console.error('⚠️ Gemini response blocked or empty')
                console.error('Candidates:', result.response?.candidates)
                console.error('Prompt feedback:', result.response?.promptFeedback)

                throw new Error('La IA no pudo generar una respuesta. Esto puede deberse a: 1) Imágenes inapropiadas, 2) Contenido bloqueado por filtros de seguridad, o 3) Error temporal de la API. Por favor, intenta con otras imágenes.')
            }

            const text = response.text()

            // Verificar que la respuesta no esté vacía
            if (!text || text.trim().length === 0) {
                console.error('⚠️ Gemini returned empty text')
                throw new Error('La IA devolvió una respuesta vacía. Por favor, intenta de nuevo.')
            }

            // DEBUG: Log the raw response
            console.log('=== GEMINI RAW RESPONSE ===')
            console.log(text)
            console.log('=== END RESPONSE ===')

            // Parsear la respuesta de la IA
            return this.parseAIResponse(text, analysisTypes)
        } catch (error: any) {
            console.error('Error en análisis de IA:', error)

            // Proporcionar mensaje de error más específico
            if (error.message.includes('SAFETY') || error.message.includes('blocked')) {
                throw new Error('Contenido bloqueado por filtros de seguridad de Gemini. Verifica que las imágenes sean apropiadas.')
            }

            throw new Error(`Error al analizar imágenes con IA: ${error.message}`)
        }
    }

    /**
     * Construye el prompt especializado según los tipos de análisis seleccionados
     */
    private buildPrompt(analysisTypes: AnalysisTypes): string {
        let prompt = `Eres un kinesiólogo deportivo generando un reporte técnico.

    REGLAS ABSOLUTAS:
    1. Escribe SOLO afirmaciones directas. NUNCA uses: "Sí", "No", "Hay", como inicio de frase.
    2. NUNCA escribas palabras sueltas como "GRÁFICO" o "EMG" al inicio. Integra en la frase.
    3. Ejemplo PROHIBIDO: "Sí, se dispone de datos..." → CORRECTO: "Los datos bilaterales muestran..."
    4. Ejemplo PROHIBIDO: "GRÁFICO Se observan..." → CORRECTO: "El gráfico EMG muestra..."
    5. NO expliques conceptos. Reporta hallazgos.
    6. JSON válido sin markdown.

    JSON a generar:
    {`;

        // 1. FLEXIBILIDAD
        if (analysisTypes.flexibilidad) {
            prompt += `
            "flexibilidad": {
                "estado": "OPTIMO | ATENCION | CRITICO",
                "tipo_imagen": "Escribe 'Gráfico EMG' o 'Fotografía postural' integrado en frase",
                "hallazgos": "FOTO: Describe amplitudes articulares observadas. GRÁFICO: Describe capacidad de relajación muscular entre activaciones.",
                "interpretacion": "Evalúa rigidez articular (foto) o tono residual (gráfico).",
                "recomendacion": "Acción concreta."
            },`;
        }

        // 2. BIOBIT
        if (analysisTypes.biobit) {
            prompt += `
            "biobit": {
                "estado": "OPTIMO | ATENCION | CRITICO",
                "tipo_dato": "Escribe 'Señal EMG de superficie' integrado en frase, no suelto",
                "patron_temporal": "Describe secuencia de activación muscular observada.",
                "sincronizacion": "Evalúa coordinación entre músculos/lados.",
                "hallazgo_clave": "Destaca hallazgo principal."
            },`;
        }

        // 3. ASIMETRÍA
        if (analysisTypes.asimetria) {
            prompt += `
            "asimetria": {
                "estado": "OPTIMO | ATENCION | CRITICO",
                "datos_disponibles": "Escribe 'Los datos bilaterales muestran...' NO 'Sí, hay datos...'",
                "comparacion": "Describe diferencias entre lado izquierdo y derecho.",
                "lado_dominante": "Escribe 'Lado izquierdo' o 'Lado derecho' o 'Patrón simétrico'",
                "magnitud": "Estima diferencia porcentual.",
                "relevancia": "Evalúa significancia clínica."
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
                "estado": "OPTIMO | ATENCION | CRITICO",
                "evolucion_temporal": "Escribe 'El registro temporal muestra...' NO preguntes si hay datos",
                "comparacion": "Compara inicio vs final del test.",
                "signos": "Describe signos de fatiga observados.",
                "nivel": "Escribe 'Sin fatiga evidente' o 'Fatiga moderada' o 'Fatiga significativa'"
            },`;
        }

        // 6. FUERZA E INERCIA
        if (analysisTypes.fuerzaInercia) {
            prompt += `
            "fuerza_inercia": {
                "estado": "OPTIMO | ATENCION | CRITICO",
                "tipo_medicion": "Escribe 'La señal EMG muestra...' integrado, no 'EMG de Superficie' suelto",
                "generacion": "Analiza pendiente de subida (explosividad).",
                "control": "Analiza pendiente de bajada (frenado).",
                "interpretacion": "Conclusión sobre eficiencia mecánica."
            },`;
        }

        // Cierre
        prompt += `
        "resumen_global": "Resumen ejecutivo en 1-2 frases completas.",
        "advertencia": null
        }
        
        RECUERDA: Escribe como médico en reporte, NO como chatbot. Integra todo en frases completas.`;

        return prompt;
    }

    /**
     * Parsea la respuesta de Gemini y extrae cada análisis
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

            // Mapear campos del JSON a los resultados
            if (analysisTypes.flexibilidad && jsonResponse.flexibilidad) {
                const flex = jsonResponse.flexibilidad
                const parts = [
                    flex.tipo_imagen,
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
                    biobit.tipo_dato,
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

        } catch (jsonError) {
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
