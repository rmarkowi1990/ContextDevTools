import { Hono } from 'hono';
import { upgradeWebSocket } from 'hono/cloudflare-workers';

const app = new Hono();

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
                console.log(`Message from client: ${event.data}`);
                ws.send('Hello from server!');
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
