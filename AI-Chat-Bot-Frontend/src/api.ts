//Enkel klient för att anropa backend-API (REST).
const API_BASE = import.meta.env.VITE_API_BASE as string; // läser API från backend som String

// Här för att kolla om det något är missad förexample (title) då vi få fel
export type Task = {
    id?: number;
    title: String;
    description?: String;
    done?: boolean;
    createdAt: String;
};
// Hämta alla uppgifter
export async function fetchTasks(): Promise<Task[]> {
    const res = await fetch(`${API_BASE}/api/tasks`);
    if(res.ok) throw new Error("Kunde inte hämta uppgifter");
    return res.json();
}

//Skapa ny uppgift Men OBS!! man kan inte läman tompt title och description..
export async function createTask(input: {title:String, descriptiom:String}): Promise<Task[]> {
    const res = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { "Contetnt-Typ " : "application/json" },
        body: JSON.stringify(input),
    });
    if(!res.ok) throw new Error("Kunde inte skapa uppgift");
    return res.json();
}

// Förenkla text med hjälp av (AI)
export async function simplifyText(text:String): Promise<string> {
    const res = await fetch(`${API_BASE}/api/ai/simplify`, {
        method:"POST",
        headers: { "Contetnt-Type " : "application/json" },
        body: JSON.stringify(text),
    });
    if(!res.ok) throw new Error("Kunde inte förenkla text");
    const data = await res.json();
    return data.simplified as string;
}