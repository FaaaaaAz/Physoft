import { useState } from 'react'
import { IoCreateOutline, IoCheckmark, IoClose } from 'react-icons/io5'
import type { AIAnalysisResult } from '@/services/api'
import { getRelativeTime } from '../../utils/date.utils'
import { CHECKLIST_LABELS } from './checklistTypes'
import './MiniChatPanel.css'

interface MiniChatPanelProps {
    result: AIAnalysisResult
    editable?: boolean
    onSave?: (newText: string) => Promise<void> | void
}

/**
 * Compact chat-transcript display: the clinician's prompt (if any) + the
 * checkbox type, followed by the AI's response. Reused by the New Assessment
 * generation flow (read-only) and the View/Edit screens (editable).
 */
function MiniChatPanel({ result, editable = false, onSave }: MiniChatPanelProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState(result.aiResponse)
    const [saving, setSaving] = useState(false)

    const startEdit = () => {
        setDraft(result.aiResponse)
        setIsEditing(true)
    }

    const cancelEdit = () => {
        setIsEditing(false)
        setDraft(result.aiResponse)
    }

    const saveEdit = async () => {
        if (!onSave || draft.trim().length === 0) return
        setSaving(true)
        try {
            await onSave(draft.trim())
            setIsEditing(false)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="mini-chat-panel">
            <div className="mini-chat-header">
                <span className="mini-chat-type">{CHECKLIST_LABELS[result.checkboxType] ?? 'Textual Analysis'}</span>
                <span className="mini-chat-timestamp">
                    {getRelativeTime(result.createdAt)}
                    {result.edited && <span className="mini-chat-edited"> &middot; edited</span>}
                </span>
            </div>

            <div className="mini-chat-body">
                {result.userPrompt && (
                    <div className="mini-chat-bubble mini-chat-bubble-user">
                        <span className="mini-chat-bubble-label">You</span>
                        <p>{result.userPrompt}</p>
                    </div>
                )}

                <div className="mini-chat-bubble mini-chat-bubble-ai">
                    <span className="mini-chat-bubble-label">AI</span>
                    {isEditing ? (
                        <textarea
                            className="mini-chat-edit-textarea"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            rows={5}
                            autoFocus
                        />
                    ) : (
                        <p>{result.aiResponse}</p>
                    )}
                </div>
            </div>

            {editable && (
                <div className="mini-chat-actions">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                className="mini-chat-action-btn mini-chat-action-save"
                                onClick={saveEdit}
                                disabled={saving || draft.trim().length === 0}
                            >
                                <IoCheckmark /> {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                className="mini-chat-action-btn"
                                onClick={cancelEdit}
                                disabled={saving}
                            >
                                <IoClose /> Cancel
                            </button>
                        </>
                    ) : (
                        <button type="button" className="mini-chat-action-btn" onClick={startEdit}>
                            <IoCreateOutline /> Edit response
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default MiniChatPanel
