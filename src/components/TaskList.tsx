import type { Task } from "../api";
import { doneTask, deleteTask } from "../api"; 
import AiSimplifyButton from "../ai/AiSimplifyButton";
import { useState } from "react";


// Definierar vilka props (värden) komponenten tar emot, så alla tasks måste ha onReplace,onEdit och onRemove
type Props= {
    tasks: Task[];  // En lista med alla uppgifter som ska visas
    onReplace: (task: Task) => void;  // En funktion för att uppdatera en uppgift när något ändras. OBS den returnera ingent för att jag ska änvanda sen i input sen.
    onEdit: (t: Task, input: { title?: string; description?: string }) => Promise<void> | void;
    // ? detta gör onRemove är optional för att när user redera under prosess kanske looper detta då hittar inte taskId då blir error
    onRemove?: (id: number) => void;
};
export default function TaskList({tasks, onReplace, onRemove, onEdit}: Props) {
  // om Task är tomt skicka ingenting bara msg
    if(!tasks.length) return <p>Ingen uppgifter ännu</p>;
// för att ändra task behöver jag de
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<{ title: string; description: string }>({ title: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Detta här uppdatera Klar checkBox , om id inte null och done inte false (Connection with API server in backend to receives data tasks)
  async function toggleDone(t: Task) {
   const updated = await doneTask(t.id!,!t.done );
    onReplace(updated);
  }
  // Redera (Connection with API server in backend to receives data tasks if delete it)
  async function remove(t: Task) {
    await deleteTask(t.id!);
    onRemove?.(t.id!);
  }
  // Ändra tasks
  function startEdit(t:Task) {
    if(t.id == null) return;
    // Tomma alla gammla error msg innan set till ingen error nu
    setErr(null);
    // ändra detta Id här
    setEditId(t.id);
    // Här hållar ändring och om det var tom ingen ändring null eller undefined det är okej skicka tom String. Annrs crashed här!!
    setForm({
      title: t.title ?? "",
      description: t.description ?? "",
    });
  }
  // Hantera spara ändring
  async function saveEdit(t:Task) {
    if(t.id == null) return;
    // kollar om title efeter trim är tom.
    if(!form.title.trim()) {
      setErr("Titel får inte vara tom.");
      return
    }
    try {
      setSaving(true);
      setErr(null);
      await onEdit(t, { title: form.title.trim(), description: form.description.trim()})
      // om vi lyckades att ändra nu stänger vi edit. Därför är null.
      setEditId(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Kunde inte spara ändringen.";
      setErr(msg);
    }finally {
      setSaving(false)
    }
  }
  // Här om vill cancle 
  function cancelEdit() {
    setEditId(null);
    setErr(null);
  }
return (
    <ul style={{ display: "grid", gap: 12 }}>
      {tasks.map((t, i) => {
        const isEditing = t.id != null && editId === t.id;
        // Här vi ska skcika description till AI men om det är null eller undefine skicka title som fallback.
        const textToSimplify = t.description ?? t.title;
        // Om task finns då har vi date om finns inte eller då bilr null
        const created = t.createdAt ? new Date(t.createdAt) : null;
        const createdLabel =
          created && !isNaN(created.getTime()) ? created.toLocaleString() : "okänt";

        return (
          <li key={t.id ?? `task-${i}`} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                {!isEditing ? (
                  <>
                    <strong style={{ textDecoration: t.done ? "line-through" : "none", wordBreak: "break-word" }}>
                      {t.title}
                    </strong>
                    {t.description && <p style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{t.description}</p>}
                    <small>Skapad: {createdLabel}</small>
                  </>
                ) : (
                  <>
                    <div style={{ display: "grid", gap: 8 }}>
                      <label>
                        <div style={{ fontSize: 12, opacity: 0.8 }}>Titel</div>
                        <input
                          value={form.title}
                          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                          placeholder="Ny titel"
                          style={{ width: "100%", padding: 8 }}
                        />
                      </label>
                      <label>
                        <div style={{ fontSize: 12, opacity: 0.8 }}>Beskrivning</div>
                        <textarea
                          value={form.description}
                          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                          placeholder="Ny beskrivning"
                          rows={3}
                          style={{ width: "100%", padding: 8 }}
                        />
                      </label>
                      {err && <div style={{ color: "red" }}>{err}</div>}
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: "grid", gap: 8, alignItems: "start", minWidth: 160 }}>
                {!isEditing && (
                  <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="checkbox" checked={!!t.done} onChange={() => toggleDone(t)} />
                    Klar
                  </label>
                )}

                {!isEditing ? (
                  <button onClick={() => startEdit(t)} style={{ background: "#f1c206d0" }}>
                    Ändra
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveEdit(t)} disabled={saving} aria-busy={saving} style={{ background: "#3bb273cc" }}>
                      {saving ? "Sparar..." : "Spara"}
                    </button>
                    <button onClick={cancelEdit} disabled={saving} style={{ background: "#aaaaaa" }}>
                      Avbryt
                    </button>
                  </>
                )}

                {!isEditing && (
                  <button onClick={() => remove(t)} style={{ background: "#f13106d0" }}>
                    Ta bort
                  </button>
                )}

                {!isEditing && textToSimplify && (
                  <AiSimplifyButton
                    taskId={t.id!}
                    currentText={textToSimplify}
                    onSimplified={(text) => onReplace({ ...t, description: text })}
                  />
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}