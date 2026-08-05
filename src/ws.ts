// WebSocket-klient (STOMP + SockJS) för att lyssna på /topic/tasks
import { Client, type IMessage} from '@stomp/stompjs'
import SocktJS from 'sockjs-client'
import type { Task } from './api'

const WS_BASE = import.meta.env.VITE_WS_BASE as string;

// Meddelande som kommer via WebSocket: antingen en hel Task (create/update) eller en delete-tombstone.
export type TaskWsMessage = Task | { deletedId: number }

// hur klient ska konnecta till socket sen i varje message gör detta.
export function connectTasks(onMessage: (taskJson: TaskWsMessage) => void) {
    const client = new Client({
        // STOMP-klient kopplad till vår /ws-endpoint i backend
        webSocketFactory: () => new SocktJS(`${WS_BASE}/ws`),
        debug: (str) => console.log('[STOMP]', str), //felsökning 
        reconnectDelay: 2000, // försök återansluta
    });
    client.onConnect = () => {
        console.log('[WS] Connected');
        // Prenumerera på /topic/tasks
        client.subscribe("/topic/tasks", (msg: IMessage) => {
            try {
                const payload = JSON.parse(msg.body) as TaskWsMessage;
                onMessage(payload);
            } catch (err) {
                console.log('[WS] Kunde inte parsa meddelandet:', err);
                console.log('[WS] Rå body:', msg.body);
            }
        });
    };
    //Starta koppling 
    client.activate();
    //Stäng av koppling när man är klar
    return () => client.deactivate();
}