import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';
import { prisma } from "../lib/prisma";

export async function createConnection(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/connections', {
            schema: {
                body: z.object({
                    userId: z.string().uuid()
                }), 
                response: {
                    200: z.object({
                        connectionsCount: z.number()
                    })
                },
            }
        }, async (request, reply) => {

            const { userId } = request.body;

            await prisma.connection.create({
                data: {
                    userId,
                }
            });

            // Query the count of connections for the user
            const connectionsCount = await prisma.connection.count({
                where: {
                    userId
                }
            });

            return reply.status(200).send({ connectionsCount });
        });
}
