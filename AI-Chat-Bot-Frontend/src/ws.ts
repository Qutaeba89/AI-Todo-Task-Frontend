// WebSocket-klient (STOMP + SockJS) för att lyssna på /topic/tasks
import { Client, type IMessage} from '@stomp/stompjs'
import SocktJS from 'sockjs-client'

const WS_BASE = import.meta.env.VITE_WS_BASE as string;

// hur klient ska konnecta till socket sen i varje message gör detta.
export function connectTasks(onMessage: (taskJson: any) => void) {
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
                const payload = JSON.parse(msg.body);
                onMessage(payload);
            } catch (err) {
                console.log('[WS] Kunde inte parsa meddelandet:', err);
                console.log('[WS] Rå body:', msg.body);
            }
        });
    };
    client.activate();
    return () => client.deactivate();
}