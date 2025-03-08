import Fastify from 'fastify';
import { FastifyInstance } from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { WebSocket } from 'ws';

const server: FastifyInstance = Fastify({
    logger: true,
});

// Register WebSocket plugin
server.register(fastifyWebsocket);
server.register(async function (fastify) {
    fastify.get('/socket', { websocket: true }, (socket: WebSocket) => {
        socket.on('update', (message: Buffer) => {
            // message.toString() === 'hi from client'
            socket.send(message);
        });
        socket.send('Hello from server');
    });
});

// WebSocket route

// Run the server!
try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running on port 3000');
} catch (err) {
    server.log.error(err);
    process.exit(1);
}
