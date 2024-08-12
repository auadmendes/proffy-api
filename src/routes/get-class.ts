import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

// Define the schema for a class
const classSchema = z.object({
    id: z.number(),
    subject: z.string(),
    //userId: z.string().uuid().nullable(),
});

export async function getAllClasses(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/classes', {
            schema: {
                summary: 'Get all classes',
                tags: ['Classes'],
                response: {
                    200: z.array(classSchema),
                },
            },
        }, async (request, reply) => {
            // Fetch all classes from the database
            const classes = await prisma.class.findMany({
                include: {
                    user: true, // Include related user data if needed
                },
            });

            // Return the list of classes
            return reply.status(200).send(classes);
        });
}
