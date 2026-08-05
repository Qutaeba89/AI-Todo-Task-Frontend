import { useEffect, useState } from 'react'
import { type Task, fetchTasks, editTask } from './api'
import { connectTasks, type TaskWsMessage } from './ws'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import './App.css'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [name, setName] = useState('')

  // Hämtar initiala uppgifter från servern
  useEffect(() => { 
    // Flagga för att undvika setState om komponenten har avmonterats.
    let mounted = true
    fetchTasks()
      .then(list => { if (mounted) setTasks(list) })
      .catch(console.error)
    return () => { mounted = false }
  }, [])

  // Här alla som online se ändring i sidan i realtid 
    useEffect(() => {
    const disconnect = connectTasks((incoming: TaskWsMessage) => {
      setTasks(prev => {
        // handle delete tombstone
        if (incoming && typeof incoming === 'object' && 'deletedId' in incoming) {
          return prev.filter(t => t.id !== incoming.deletedId)
        }
        // add/replace by id
        if (!incoming || incoming.id == null) return prev
        const idx = prev.findIndex(t => t.id === incoming.id)
        // Här ny task om index inte -1
        if (idx === -1) return [incoming as Task, ...prev]
        // copia av current tasks list.
        const copy = [...prev]
        // lägg till nya tasks eller updatera task med nya list
        copy[idx] = incoming as Task
        return copy
      })
    })
    // Stäng connection när user stänger sidan eller lämnar
    return () => { void disconnect() }
  }, [])
  
// handel ändring
  async function handleEdit(t: Task, input: { title?: string; description?: string }) {
  if (t.id == null) return;
  const edited = await editTask(t.id, input);

  // replace the task in local state
  setTasks(prev => {
    // hiitar här id som vi ska ändra om det finns
    const idx = prev.findIndex(x => x.id === edited.id);
    // om task finns inte retrurns gammla tasks list (sakerhet check). om det något fel kunde inte hitta id då stoppar ändra inte listan.
    if (idx === -1) return prev;
    // en copia av nuvarande tasks list innand ändring 
    const copy = [...prev];
    // nu ändra gammla tasks list med nya som har ändrats
    copy[idx] = edited;
    return copy;
  });
}
// Här när jag är klar med en task ska vara längst ner 
const sortedTasks = [...tasks].sort((a, b) => {
  return (a.done ? 1 : 0) - (b.done ? 1 : 0);
});

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: 12,backgroundColor: 'rgba(28, 27, 30, 0.75)',backdropFilter: 'blur(10px)',borderRadius: '16px',border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <header style={{ marginBottom: 16 }}>
        <h1>Mina Uppgifter</h1>
        <p>Välkommen! Skriv ditt namn och börja lägga till uppgifter. Alla ser ändringarna direkt.</p>
        <input
          style={{ marginTop: 8 }}
          placeholder="Skriv ditt namn (valfritt)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </header>

      <TaskForm />

      <section>
        <h2>Lista</h2>
        <TaskList
          tasks={sortedTasks}
          onReplace={(updated) => {
            setTasks(prev => {
              if (updated.id == null) return prev
              const idx = prev.findIndex(t => t.id === updated.id)
              if (idx === -1) return prev
              const copy = [...prev]
              copy[idx] = updated
              return copy
            })
          }}
          onRemove={(id) => {
            setTasks(prev => prev.filter(t => t.id !== id))
          }}
          onEdit={handleEdit}
        />
      </section>
    </div>
  )
}
