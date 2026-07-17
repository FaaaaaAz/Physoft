import Anthropic from '@anthropic-ai/sdk'
import { ChecklistType } from '../../domain/types/claudeAnalysis'
import * as promptBuilder from './claude/promptBuilder'
import type {
    PatientDemographics,
    PatientContextFallback,
    BodyMarkLike,
    FlexibilityRatingContext
} from './claude/promptBuilder'

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
    // Richer clinical context, gathered by the controller before calling this service.
    patientDemographics?: PatientDemographics | null
    evaluationDate?: string | null
    bodyMarks?: BodyMarkLike[] | null
    flexibilityRatings?: FlexibilityRatingContext[] | null
}

interface AnalyzeAssessmentResult {
    aiResponse: string
    tokensUsed: number
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
        const { checkboxType, imageFiles, pdfFiles } = input

        const system = promptBuilder.getSystemPrompt(checkboxType)
        const content = this.buildUserContentBlocks(input)

        console.log(`[Claude] Analyzing "${checkboxType}" — ${imageFiles.length} image(s), ${pdfFiles.length} PDF(s)`)

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

    private buildUserContentBlocks(input: AnalyzeAssessmentInput): Anthropic.MessageParam['content'] {
        const { pdfFiles, imageFiles } = input
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

        const text = promptBuilder.buildUserText({
            checkboxType: input.checkboxType,
            userPrompt: input.userPrompt,
            patientDemographics: input.patientDemographics,
            patientContextFallback: input.patientContext as PatientContextFallback | undefined,
            previousAssessmentsSummary: input.patientContext?.previousAssessmentsSummary,
            evaluationDate: input.evaluationDate,
            bodyMarks: input.bodyMarks,
            flexibilityRatings: input.flexibilityRatings,
            hasAttachments: imageFiles.length > 0 || pdfFiles.length > 0
        })

        blocks.push({ type: 'text', text })

        return blocks
    }
}

export default new ClaudeAnalysisService()
