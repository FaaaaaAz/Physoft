import './ButtonSpinner.css'

/** Small spinning ring that inherits the button's current text color. */
export function ButtonSpinner({ className = '' }: { className?: string }) {
    return <span className={`button-spinner ${className}`} aria-hidden="true" />
}

interface ButtonLoadingContentProps {
    text: string
}

/**
 * Drop-in replacement for a button's label while an async action is in
 * flight — spinner + text, centered and fading in together so the swap
 * never flickers. Reused across every "Saving...", "Deleting...", etc. button.
 */
export function ButtonLoadingContent({ text }: ButtonLoadingContentProps) {
    return (
        <span className="button-loading-content">
            <ButtonSpinner />
            {text}
        </span>
    )
}
