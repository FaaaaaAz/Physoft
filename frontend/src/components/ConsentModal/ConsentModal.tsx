import { useEffect, useState, type ReactNode } from 'react'
import { IoClose, IoDocumentTextOutline, IoDownloadOutline } from 'react-icons/io5'
import { CONSENT_DOCUMENT } from './consentDocument'
import consentPdfUrl from '../../assets/legal/patient-consent.pdf?url'
import './ConsentModal.css'

interface ConsentModalProps {
    isOpen: boolean
    onCancel: () => void
    onAccept: () => void
}

// Splits "Label Words. Rest of the clause..." so the short label can be
// bolded while the body text renders normally. Falls back to the raw text
// untouched if a clause doesn't match the pattern, so nothing is ever lost.
function renderClauseText(text: string): ReactNode {
    const match = text.match(/^([A-Za-z][A-Za-z\s/'-]*\.)\s*([\s\S]*)$/)
    if (!match) return text
    return (
        <>
            <strong className="consent-doc-clause-label">{match[1]}</strong>{' '}
            {match[2]}
        </>
    )
}

function ConsentModal({ isOpen, onCancel, onAccept }: ConsentModalProps) {
    const [agreed, setAgreed] = useState(false)

    useEffect(() => {
        if (isOpen) setAgreed(false)
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onCancel])

    if (!isOpen) return null

    return (
        <div
            className="consent-modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onCancel()
            }}
        >
            <div className="consent-modal" role="dialog" aria-modal="true" aria-labelledby="consent-modal-title">
                <div className="consent-modal-header">
                    <div className="consent-modal-header-info">
                        <span className="consent-modal-header-icon">
                            <IoDocumentTextOutline />
                        </span>
                        <div>
                            <h2 id="consent-modal-title">Patient Consent &amp; Terms of Service</h2>
                            <p>Please review the full agreement before starting a new assessment.</p>
                        </div>
                    </div>
                    <button className="consent-modal-close" onClick={onCancel} aria-label="Close">
                        <IoClose />
                    </button>
                </div>

                <div className="consent-modal-body">
                    <header className="consent-doc-cover">
                        <span className="consent-doc-company">{CONSENT_DOCUMENT.companyName}</span>
                        <h1>{CONSENT_DOCUMENT.documentTitle}</h1>
                        <p className="consent-doc-subtitle">{CONSENT_DOCUMENT.documentSubtitle}</p>
                    </header>

                    <div className="consent-doc-notice">{CONSENT_DOCUMENT.notice}</div>
                    <p className="consent-doc-effective">{CONSENT_DOCUMENT.effectiveLine}</p>

                    {CONSENT_DOCUMENT.sections.map(section => (
                        <section key={section.id} className="consent-doc-section">
                            <h3>{section.id}. {section.title}</h3>
                            {section.clauses.map(clause => (
                                <p key={clause.number} className="consent-doc-clause">
                                    <span className="consent-doc-clause-number">{clause.number}</span>
                                    {renderClauseText(clause.text)}
                                </p>
                            ))}
                        </section>
                    ))}

                    <h2 className="consent-doc-appendices-heading">Appendices</h2>

                    {CONSENT_DOCUMENT.appendices.map(appendix => (
                        <section key={appendix.id} className="consent-doc-section consent-doc-appendix">
                            <h3>{appendix.title}</h3>
                            {appendix.clauses.map(clause => (
                                <p key={clause.number} className="consent-doc-clause">
                                    <span className="consent-doc-clause-number">{clause.number}</span>
                                    {/* Only Appendix A follows the "Short Label. Body" convention used in
                                        sections 1-30; B and C are plain prose in the source document. */}
                                    {appendix.id === 'A' ? renderClauseText(clause.text) : clause.text}
                                </p>
                            ))}
                        </section>
                    ))}

                    <p className="consent-doc-control-note">{CONSENT_DOCUMENT.documentControlNote}</p>
                </div>

                <div className="consent-modal-footer">
                    <label className="consent-modal-checkbox">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <span>I have read and agree to the Terms and Conditions and Informed Consent.</span>
                    </label>

                    <div className="consent-modal-actions">
                        <a className="consent-modal-download" href={consentPdfUrl} download="patient-consent.pdf">
                            <IoDownloadOutline />
                            Download PDF
                        </a>

                        <div className="consent-modal-buttons">
                            <button className="consent-modal-btn consent-modal-btn-cancel" onClick={onCancel}>
                                Cancel
                            </button>
                            <button
                                className="consent-modal-btn consent-modal-btn-continue"
                                onClick={onAccept}
                                disabled={!agreed}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConsentModal
