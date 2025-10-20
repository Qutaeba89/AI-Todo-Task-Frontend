import type { Task } from "../api";

type Props= {
    tasks: Task[];
    onReplace: (task: Task) => void;
};
export default function TaskList({tasks, onReplace}: Props) {
    if(!tasks.length) return <p>Ingen uppgifter ännu</p>;

    return (
        <ul style={{ display: 'grid', gap: 12 }}>
            {tasks.map((t,i) => {
                const textToSimplify = t.description ?? t.title;
                const created = t.createdAt ? new Date(t.createdAt) : null;
                const  createdLabel = created && isNaN(created.getTime()) ? created.toLocaleString() : 'okänt';

            return (
                <li key={t.id ?? `task-${i}`} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <strong>{t.title}</strong>
                {t.description && <p style={{ marginTop: 6 }}>{t.description}</p>}
                <small>Skapad: {createdLabel}</small>
              </div>
            </div>
          </li>
            )
            })}
        </ul>
    )
}
