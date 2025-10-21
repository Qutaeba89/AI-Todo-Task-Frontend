import { useEffect, useState } from 'react'
import { type Task, fetchTasks } from './api'
import { connectTasks } from './ws'
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

  // Realtidskoppling WebSocket/SSE för inkommande Task uppdateringar.
  useEffect(() => {
    const disconnect = connectTasks((incoming: Task) => {
      setTasks(prev => { // Varje gång server skicka nya tasks
        if (incoming.id == null) return prev  // Gör ingenting om id var null
        const idx = prev.findIndex(t => t.id === incoming.id) 
        if (idx === -1) return [incoming, ...prev] // Om taks finns inte i gammla lista lägg upp det först i listan
        const copy = [...prev] // Om hittar task copy detta
        copy[idx] = incoming // Byt gammla list med nya 
        return copy // returnera ny lista
      })
    })
    return () => { void disconnect() } // clean när app avmonterats, och stäng connection
  }, [])

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: 12 }}>
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
          tasks={tasks}
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
        />
      </section>
    </div>
  )
}
