import Anthropic from '@anthropic-ai/sdk'
import { ChecklistType, CHECKLIST_LABELS } from '../../domain/types/claudeAnalysis'

interface PatientContext {
    name?: string
    age?: number
    sport?: string
    previousAssessmentsSummary?: string
}

interface ImageFile {
    buffer: Buffer
    mimeType: string
}

interface PdfFile {
    buffer: Buffer
    filename: string
}

interface AnalyzeAssessmentInput {
    checkboxType: ChecklistType
    userPrompt?: string | null
    patientContext?: PatientContext
    imageFiles: ImageFile[]
    pdfFiles: PdfFile[]
}

interface AnalyzeAssessmentResult {
    aiResponse: string
    tokensUsed: number
}

// Clinical framing for the 4 predefined checkbox types. "free" has no predefined
// meaning by design -- all direction there comes from the clinician's own prompt.
const CLINICAL_CONTEXT: Record<Exclude<ChecklistType, 'free'>, string> = {
    flexibility: 'Flexibility Analysis: focus on joint range of motion, muscle relaxation/elasticity, and any restrictions or asymmetries in flexibility visible in the attached material.',
    biobit: 'Biobit Analysis: focus on muscle activation patterns, timing, and coordination visible in the attached material.',
    asymmetry: 'Muscular Activation Asymmetry: focus on bilateral (left vs. right) comparison, identifying imbalances in activation, timing, or magnitude between corresponding muscle groups.',
    motorControl: 'Active Motor Control Analysis: focus on neuromuscular stability, movement quality, and control patterns visible in the attached material.'
}

class ClaudeAnalysisService {
    private client: Anthropic
    private modelName: string

    constructor() {
        const apiKey = process.env.ANTHROPIC_API_KEY
        if (!apiKey) {
            throw new Error('ANTHROPIC_API_KEY is not configured in the environment variables')
        }

        this.modelName = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5'
        this.client = new Anthropic({ apiKey })
        console.log(`[Claude] Service initialized (${this.modelName})`)
    }

    async analyzeAssessment(input: AnalyzeAssessmentInput): Promise<AnalyzeAssessmentResult> {
        const { checkboxType, userPrompt, patientContext, imageFiles, pdfFiles } = input

        const system = this.buildSystemPrompt(checkboxType)
        const content = this.buildUserContentBlocks(checkboxType, userPrompt, patientContext, imageFiles, pdfFiles)

        console.log(`[Claude] Analyzing "${CHECKLIST_LABELS[checkboxType]}" — ${imageFiles.length} image(s), ${pdfFiles.length} PDF(s)`)

        try {
            const response = await this.client.messages.create({
                model: this.modelName,
                max_tokens: 2048,
                system,
                messages: [{ role: 'user', content }]
            })

            if (response.stop_reason === 'refusal') {
                throw new Error('The AI declined to analyze the provided content. Please review the files and prompt.')
            }

            const textBlock = response.content.find((block): block is Anthropic.TextBlock => block.type === 'text')
            const aiResponse = textBlock?.text?.trim()

            if (!aiResponse) {
                throw new Error('The AI returned an empty response. Please try again.')
            }

            const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)

            return { aiResponse, tokensUsed }
        } catch (error: any) {
            console.error('[Claude] Error analyzing assessment:', error)

            if (error instanceof Anthropic.APIError) {
                if (error.status === 401) {
                    throw new Error('Invalid Anthropic API key. Please check ANTHROPIC_API_KEY in the server configuration.')
                }
                if (error.status === 429) {
                    throw new Error('Anthropic API rate limit reached. Please try again in a moment.')
                }
                if (error.status === 413 || error.message?.includes('too large')) {
                    throw new Error('The attached files are too large for the AI request. Please reduce file size or count.')
                }
                throw new Error(`AI analysis failed: ${error.message}`)
            }

            throw error
        }
    }

    private buildSystemPrompt(checkboxType: ChecklistType): string {
        const base = 'You are a clinical assistant supporting a licensed physiotherapist/kinesiologist ' +
            'in interpreting patient assessment data (images and/or documents). ' +
            'Respond in clear, professional clinical prose as if writing a note for a colleague — ' +
            'no JSON, no markdown headers, no bullet-point templates. Reference specific evidence from ' +
            'the attached files where possible. Be concise but substantive (a few focused paragraphs).'

        if (checkboxType === 'free') {
            return base + ' The clinician will provide their own specific instructions for this analysis — follow them directly.'
        }

        return `${base}\n\nClinical context for this analysis: ${CLINICAL_CONTEXT[checkboxType]}`
    }

    private buildUserContentBlocks(
        checkboxType: ChecklistType,
        userPrompt: string | null | undefined,
        patientContext: PatientContext | undefined,
        imageFiles: ImageFile[],
        pdfFiles: PdfFile[]
    ): Anthropic.MessageParam['content'] {
        const blocks: Anthropic.MessageParam['content'] = []

        for (const pdf of pdfFiles) {
            blocks.push({
                type: 'document',
                source: {
                    type: 'base64',
                    media_type: 'application/pdf',
                    data: pdf.buffer.toString('base64')
                }
            } as Anthropic.DocumentBlockParam)
        }

        for (const image of imageFiles) {
            blocks.push({
                type: 'image',
                source: {
                    type: 'base64',
                    media_type: image.mimeType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
                    data: image.buffer.toString('base64')
                }
            } as Anthropic.ImageBlockParam)
        }

        const textParts: string[] = []

        if (patientContext && (patientContext.name || patientContext.age || patientContext.sport || patientContext.previousAssessmentsSummary)) {
            const parts: string[] = []
            if (patientContext.name) parts.push(`Name: ${patientContext.name}`)
            if (patientContext.age !== undefined) parts.push(`Age: ${patientContext.age}`)
            if (patientContext.sport) parts.push(`Sport: ${patientContext.sport}`)
            textParts.push(`Patient context — ${parts.join(', ')}.`)
            if (patientContext.previousAssessmentsSummary) {
                textParts.push(`Previous assessments: ${patientContext.previousAssessmentsSummary}`)
            }
        }

        if (checkboxType === 'free') {
            textParts.push(`Requested analysis: ${userPrompt}`)
        } else {
            textParts.push(`Please perform a ${CHECKLIST_LABELS[checkboxType]} based on the attached file(s).`)
            if (userPrompt && userPrompt.trim().length > 0) {
                textParts.push(`Additional focus requested by the clinician: ${userPrompt.trim()}`)
            }
        }

        if (imageFiles.length === 0 && pdfFiles.length === 0) {
            textParts.push('(No files were attached — base the analysis on the prompt and patient context alone.)')
        }

        blocks.push({ type: 'text', text: textParts.join('\n\n') })

        return blocks
    }
}

export default new ClaudeAnalysisService()
