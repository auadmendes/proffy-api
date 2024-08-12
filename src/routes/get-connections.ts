import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

// Define the schema for the connection count response
const connectionCountSchema = z.object({
    count: z.number(),
});

export async function getConnectionCount(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/connections/count', {
            schema: {
                summary: 'Get the total number of connections',
                tags: ['Connections'],
                response: {
                    200: connectionCountSchema,
                },
            },
        }, async (request, reply) => {
            // Count the total number of connections
            const count = await prisma.connection.count();

            // Return the connection count
            return reply.status(200).send({ count });
        });
}
