import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function createClasses(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/users/:userId/classes', {
            schema: {
                summary: 'Create a class for a user and return all classes',
                tags: ['User'],
                body: z.object({
                    subject: z.string(),
                }),
                params: z.object({
                    userId: z.string().uuid(), // Example: ec8fdb53-282e-4c0b-95de-2de7bd90233f
                }),
                response: {
                    201: z.object({
                        classes: z.array(z.object({
                            id: z.number(),
                            subject: z.string(),
                        })),
                    }),
                },
            },
        }, async (request, reply) => {
            const { subject } = request.body;
            const { userId } = request.params;

            // Check if the class subject already exists for the user
            const classSubject = await prisma.class.findFirst({
                where: {
                    subject,
                    userId,
                }
            });

            if (classSubject) {
                throw new Error('Class subject already exists for this user');
            }

            // Create the new class for the user
            await prisma.class.create({
                data: {
                    subject,
                    userId,
                },
            });

            // Fetch all classes for the user
            const userClasses = await prisma.class.findMany({
                where: {
                    userId,
                },
                select: {
                    id: true,
                    subject: true,
                },
            });

            return reply.status(201).send({ classes: userClasses });
        });
}
