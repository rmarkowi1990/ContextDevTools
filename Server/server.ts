import { Hono } from 'hono';
import { upgradeWebSocket } from 'hono/cloudflare-workers';
import { cors } from 'hono/cors';
import {
    ErrorMessage,
    ServerMessage,
    validateClientMessage,
} from './Zod/Messages';

const SERVER_ID = 'server-1';

const app = new Hono();

app.use('/*', cors());

app.get('/', (c) => {
    return c.json({
        ok: true,
        message: 'Hello World!',
    });
});

app.get(
    '/update',
    upgradeWebSocket((c) => {
        return {
            onMessage(event, ws) {
                const messageData = JSON.parse(event.data);

                try {
                    const validatedMessage = validateClientMessage(messageData);

                    if (!validatedMessage) {
                        console.error('Invalid client message');
                        const serverErrorMessage: ErrorMessage = {
                            type: 'SERVER',
                            event: 'ERROR',
                            payload: {
                                message: 'Invalid client message',
                            },
                            server_date: new Date().toISOString(),
                            server_id: SERVER_ID,
                        };
                        ws.send(JSON.stringify(serverErrorMessage));
                    } else {
                        const timestampedServerMessage: ServerMessage = {
                            ...validatedMessage,
                            type: 'SERVER',
                            server_date: new Date().toISOString(),
                            server_id: SERVER_ID,
                        };

                        ws.send(JSON.stringify(timestampedServerMessage));
                    }
                } catch (error) {
                    console.error('Invalid client message, ', error);
                    const serverErrorMessage: ErrorMessage = {
                        type: 'SERVER',
                        event: 'ERROR',
                        payload: {
                            message: 'Invalid client message',
                            error,
                        },
                        server_date: new Date().toISOString(),
                        server_id: SERVER_ID,
                    };
                    ws.send(JSON.stringify(serverErrorMessage));
                }
            },
            onClose: () => {
                console.log('Connection closed');
            },
        };
    })
);

console.log('Server is running on port 8787');

// Add this export
export default {
    fetch: app.fetch,
};
