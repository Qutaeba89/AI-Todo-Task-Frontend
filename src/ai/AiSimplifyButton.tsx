import { useState } from "react";
import { simplifyText } from "../api";

type Props = {
    currentText: string;
    onSimplified: (text: string) => void 
}

export default function AiSimplifyButton({currentText, onSimplified}: Props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function onClick() {
        if(loading) return;
        const input= currentText.trim() ?? ''
        if(!input) {
            setError("Ingen text att förenkla.")
            return
        }
        try {
            setLoading(true) // Button ska inte clickable för att det är tommt input
            setError(null) // Tomma all medelande
            // Skicka till api sen vänta på result
            const simplified = await simplifyText(input)
            // Om ingen ändring i texten det är onödigt att skicka det , då koden skickar inte något
            if (simplified && simplified !== currentText) {
                onSimplified(simplified)
            }
        } catch (e) {
            const msg = e instanceof Error ? e.message: "Kunde inte förenkla texten."
            setError(msg)
        } finally // Run detta hela tiden som false
        {
            setLoading(false)
        }
    }
    return (
        <div style={{ textAlign: 'right' }}>
            <button onClick={onClick} disabled={loading} aria-busy={loading}>
            {loading ? 'Arbetar...' : 'Förenkla text (AI)'}
            </button>
            {/* aria-live gör att skärmläsare hör felmeddelandet */}
            {error && (
                <div role="status" aria-live="polite" style={{ color: 'red', marginTop: 6 }}>
            {error}
                </div>
            )}
        </div>
    )
}