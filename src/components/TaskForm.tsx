import { useState, useRef } from "react";
import { createTask } from "../api";

export default function TaskForm() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [load, setLoad] = useState(false)
    const [msg, setMsg] = useState<string | null>(null)
    // för pointing till input fält
    const titleRef = useRef<HTMLInputElement>(null)
    
    const titleClean = title.trim()
    const titleTooShort = titleClean.length > 0 && titleClean.length < 3
    const titleLimit = 200
    const titleTooLong = titleClean.length > titleLimit
    const descClean = description.trim();
    const descLimit = 200
    const descTooLong = descClean.length > descLimit


async function onSubmit(e: React.FormEvent) {
  // ladda inte om sidan
    e.preventDefault()
    
    // Detta tillåt INTE
    // 1- Om title efter trim är tompt setMsg sen titleRef ska focus i input filt. 
    if(!titleClean) {
        setMsg("Titel får inte vara tom (bara mellanslag räknas som tomt).")
        // titleRedf göra här när man lämna filt tom Cursor ska pointa tillbaka till input.
        titleRef.current?.focus()
        return
    }
    if(titleTooShort) {
        setMsg("Titel måste vara minst 3 tecken.")
        titleRef.current?.focus()
        return
    }
    if(titleTooLong) {
        setMsg(`Titel får max ${titleLimit} tecken.`)
        titleRef.current?.focus()
        return
    }
    if(descTooLong) {
        setMsg(`Beskrivning får max ${descLimit} tecken.`)
        return
    }
    try {
        setLoad(true) // Detta för att disable submit button och visa bara Spara.
        setMsg(null) // Tomma alla gammla msg från gammla försökt 
        await createTask({
            title: titleClean,
            //description: description.trim() || undefined,
            description: descClean || undefined, // Detta har om jag lämnade description tompt detta skickar inte det blir bara title. 
        })
        // Här när man success resta alla input
        setTitle("") // Om success  tomma
        setDescription("")
        setMsg("Uppgift sparad.") // När success 
        titleRef.current?.focus() // Lägg cursor tillbaka till input title för nästa gång
    } catch {
        setMsg("Kunde inte spara. Försök igen.")
    } finally {
        // button ska vara olåst
        setLoad(false)
    }
}

return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, marginBottom: 16, maxWidth: 420, margin: '0 auto' }}>
      <h2>Lägg till uppgift</h2>

      {/* statusrad  kolla om msg är tomt eller här Uppgift sparat sen set färg */}
      {msg && (
        <p aria-live="polite" style={{ margin: 0, color: msg.startsWith('Uppgift') ? 'green' : 'crimson' }}>
          {msg}
        </p>
      )}

      <label style={{ display: 'grid', gap: 4 }}>
        Titel
        <input
          ref={titleRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Skriv titel..."
        />
      </label>

      <label style={{ display: 'grid', gap: 4 }}>
        Beskrivning
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Skriv beskrivning..."
          rows={3}
        />
        {/* small här kontrollera  description length*/}
        <small style={{ color: descTooLong ? 'crimson' : undefined }}>
          {description.length}/{descLimit}
        </small>
      </label>
      {/* här disable button när load är true */}
      <button type="submit" disabled={load}>
        {load ? 'Sparar...' : 'Spara uppgift'}
      </button>
    </form>
  )
}
