import { IoAlertCircleOutline } from 'react-icons/io5'
import type { AIAnalysisResult } from '@/services/api'
import { ChecklistType, CHECKLIST_LABELS, CHECKLIST_DESCRIPTIONS } from './checklistTypes'
import AnalysisFileUpload from './AnalysisFileUpload'
import MiniChatPanel from './MiniChatPanel'
import './ChecklistItem.css'

export interface ChecklistItemState {
    checked: boolean
    files: File[]
    prompt: string
    loading: boolean
    error: string | null
    result: AIAnalysisResult | null
}

interface ChecklistItemProps {
    type: ChecklistType
    state: ChecklistItemState
    onToggle: (checked: boolean) => void
    onFilesChange: (files: File[]) => void
    onPromptChange: (prompt: string) => void
}

function ChecklistItem({ type, state, onToggle, onFilesChange, onPromptChange }: ChecklistItemProps) {
    const isFree = type === 'free'
    const promptMissing = isFree && state.prompt.trim().length === 0

    return (
        <div className={`checklist-item ${state.checked ? 'checked' : ''}`}>
            <label className="checklist-item-toggle">
                <input
                    type="checkbox"
                    checked={state.checked}
                    onChange={(e) => onToggle(e.target.checked)}
                />
                <span className="checklist-item-label">{CHECKLIST_LABELS[type]}</span>
            </label>
            <p className="checklist-item-description">{CHECKLIST_DESCRIPTIONS[type]}</p>

            {state.checked && (
                <div className="checklist-item-body">
                    <AnalysisFileUpload
                        files={state.files}
                        onChange={onFilesChange}
                        disabled={state.loading}
                    />

                    <div className="checklist-item-prompt-group">
                        <textarea
                            className={`checklist-item-prompt ${promptMissing ? 'required-empty' : ''}`}
                            value={state.prompt}
                            onChange={(e) => onPromptChange(e.target.value)}
                            placeholder={
                                isFree
                                    ? 'Describe the analysis you want the AI to perform (required)...'
                                    : "Optional: Add specific focus for AI analysis (e.g., 'Compare left vs right asymmetry')"
                            }
                            rows={2}
                            disabled={state.loading}
                        />
                        {promptMissing && (
                            <span className="checklist-item-prompt-hint">
                                A prompt is required for "Free" analysis
                            </span>
                        )}
                    </div>

                    {state.loading && (
                        <div className="checklist-item-loading">
                            <span className="checklist-item-spinner" />
                            Analyzing with AI...
                        </div>
                    )}

                    {state.error && (
                        <div className="checklist-item-error">
                            <IoAlertCircleOutline /> {state.error}
                        </div>
                    )}

                    {state.result && (
                        <MiniChatPanel result={state.result} editable={false} />
                    )}
                </div>
            )}
        </div>
    )
}

export default ChecklistItem
