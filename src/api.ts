//Enkel klient för att anropa backend-API (REST).
const API_BASE = import.meta.env.VITE_API_BASE as string; // läser API från backend som String och visa React finns det i .env

// Här för att kolla om det något är missad förexample (title) då vi få fel. ? betyder valfritt fält
export type Task = {
    id?: number;
    title: string;
    description?: string;
    done?: boolean;
    createdAt?: string;
};
    // Hämta alla uppgifter från servern
    export async function fetchTasks(): Promise<Task[]> {
        // res hämtar alla tasks (GET resquest från backend)
        const res = await fetch(`${API_BASE}/api/tasks`);
        if(!res.ok) throw new Error("Kunde inte hämta uppgifter");
        return res.json();
    }

    //Skapa ny uppgift Men OBS!! man kan inte läman tompt title och description..
    // description?:string ? det betyder att string kan vara tompt
    export async function createTask(input: {title:string, description?:string}): Promise<Task> {
        const res = await fetch(`${API_BASE}/api/tasks`, {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(input),
        });
        if(!res.ok) throw new Error("Kunde inte skapa uppgift");
        return res.json();
    }

    // Förenkla text med hjälp av (AI)
    export async function simplifyText(text:string): Promise<string> {
        const res = await fetch(`${API_BASE}/api/ai/simplify`, {
            method:"POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify({text}),
        });
        if(!res.ok) throw new Error("Kunde inte förenkla text");
        const data = await res.json();
        // server skicka inte bara string men skickar också object därför in return skrev as string för att läsa som string
        console.log('[simplifyText] response:', data);
        return data.simplified as string;
    }

    // Update
    export async function doneTask(
        id: number,
        // partial här säg innen i object kan det vara valfritt, då vi kan göra ändraing på vilka som helst
        isDone: boolean){
        const input = { done: isDone };
        const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });
        if (!res.ok) throw new Error("Kunde inte klara uppgift");
        return res.json();
    }
    // Edit
    export async function editTask(
        id: number,
        input: Partial<{ title: string; description: string;}>
        ) {
        const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });
        if (!res.ok) throw new Error("Kunde inte uppdatera uppgift");
        return res.json();
    }

    // Radera
    export async function deleteTask(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Kunde inte radera uppgift");
    }