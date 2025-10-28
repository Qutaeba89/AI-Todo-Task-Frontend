import { useState } from "react";
import { simplifyText, editTask } from "../api";

// hät vi ska säga vilken taskId ska ändra/redera eller klara.
type Props = {
    taskId: number;
    currentText: string;
    onSimplified: (text: string) => void 
}

export default function AiSimplifyButton({ taskId ,currentText, onSimplified}: Props) {
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

            // 1) Skicka till api sen vänta på result
            const simplified = await simplifyText(input)
            // 2) Spara till servern → backend broadcastar till alla flikar
             await editTask(taskId, { description: simplified });

            // Om ingen ändring i texten det är onödigt att skicka det , då koden skickar inte något
            //if (simplified && simplified !== currentText) {
                onSimplified(simplified)
            //}
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
            <button onClick={onClick} disabled={loading} aria-busy={loading} style={{ background: loading ? '#aaaaaa5d' : '#06f10ac7' }}>
            {loading ? 'Arbetar...' : 'Förenkla text (AI)'}
            </button>
            {error && (
                <div role="status" aria-live="polite" style={{ color: 'red', marginTop: 6 }}>
            {error}
                </div>
            )}
        </div>
    )
}