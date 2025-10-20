import type { Task } from "../api";
import AiSimplifyButton from "../ai/AiSimplifyButton";

// Definierar vilka props (värden) komponenten tar emot
type Props= {
    tasks: Task[];  // En lista med alla uppgifter som ska visas
    onReplace: (task: Task) => void;  // En funktion för att uppdatera en uppgift när något ändras. OBS den returnera ingent för att jag ska änvanda sen i input sen.
};
export default function TaskList({tasks, onReplace}: Props) {
    if(!tasks.length) return <p>Ingen uppgifter ännu</p>;

    return (
        <ul style={{ display: 'grid', gap: 12 }}>
            {tasks.map((t,i) => { // Loopa igenom alla uppgifter
                const textToSimplify = t.description ?? t.title;  // Om beskrivning finns, använd den, annars titel
                const created = t.createdAt ? new Date(t.createdAt) : null; // Gör om datum-text till ett Date-objekt
                const  createdLabel = 
                // Kolla om datumet är giltigt
                    created && isNaN(created.getTime())
                    // Visa datum i läsbar form
                    ? created.toLocaleString() : 'okänt';

            return (
                <li key={t.id ?? `task-${i}`} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <strong>{t.title}</strong>
                {t.description && <p style={{ marginTop: 6 }}>{t.description}</p>}
                <small>Skapad: {createdLabel}</small>
              </div>
                {textToSimplify && (
                <AiSimplifyButton
                  currentText={textToSimplify}
                  onSimplified={(text) => onReplace({ ...t, description: text })}
                />
              )}
            </div>
          </li>
            )
            })}
        </ul>
    )
}
