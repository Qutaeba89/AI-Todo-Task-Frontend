//Enkel klient för att anropa backend-API (REST).
const API_BASE = import.meta.env.VITE_API_BASE as string; // läser API från backend som String

// Här för att kolla om det något är missad förexample (title) då vi få fel
export type Task = {
    id?: number;
    title: string;
    description?: string;
    done?: boolean;
    createdAt: string;
};
// Hämta alla uppgifter
export async function fetchTasks(): Promise<Task[]> {
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
    console.log('[simplifyText] response:', data);
    return data.simplified as string;
}