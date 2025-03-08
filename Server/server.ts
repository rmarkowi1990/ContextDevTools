import Fastify from 'fastify';
import { FastifyInstance } from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { WebSocket } from 'ws';

const server: FastifyInstance = Fastify({
    logger: true,
});

server.register(fastifyWebsocket);
server.register(async function (fastify) {
    fastify.get('/socket', { websocket: true }, (socket: WebSocket) => {
        socket.on('update', (message: Buffer) => {
            socket.send(message);
        });
    });
});

try {
    await server.listen({ port: 2761, host: '0.0.0.0' });
    console.log('Server is running on port 2761');
} catch (err) {
    server.log.error(err);
    process.exit(1);
}
