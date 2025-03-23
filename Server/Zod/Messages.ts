import { z } from 'zod';

export const MessageSchema = z.object({
    type: z.enum(['CLIENT', 'SERVER']),
    event: z.enum(['RENDER', 'ERROR']),
    payload: z.any(),
});

export const ClientMessageSchema = MessageSchema.extend({
    send_date: z.string().datetime(),
    client_id: z.string(),
});

export const ServerMessageSchema = ClientMessageSchema.extend({
    server_date: z.string().datetime(),
    server_id: z.string(),
});

export const ErrorMessageSchema = MessageSchema.extend({
    send_date: z.string().datetime().optional(),
    client_id: z.string().optional(),
    server_date: z.string().datetime().optional(),
    server_id: z.string().optional(),
});

export type ClientMessage = z.infer<typeof ClientMessageSchema>;
export type ServerMessage = z.infer<typeof ServerMessageSchema>;
export type ErrorMessage = z.infer<typeof ErrorMessageSchema>;
export function validateClientMessage(
    message: unknown
): ClientMessage | undefined {
    return ClientMessageSchema.parse(message);
}

export function validateServerMessage(
    message: unknown
): ServerMessage | undefined {
    return ServerMessageSchema.parse(message);
}
