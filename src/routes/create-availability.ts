import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function createAvailability(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/availability', {
            schema: {
                body: z.object({
                    userId: z.string().uuid(),
                    classId: z.number(), 
                    cost: z.number(),
                    scheduleItems: z.array(z.object({
                        week_day: z.number().min(0).max(6), 
                        from: z.number(),
                        to: z.number()
                    })),
                }),
                response: {
                    201: z.object({
                        id: z.string().uuid(),
                        day: z.number(),
                        startTime: z.number(),
                        endTime: z.number(),
                        cost: z.number().positive(),
                        userId: z.string().uuid().nullable(),
                        classId: z.number().nullable(),
                    }),
                },
            },
        }, async (request, reply) => {
            const { userId, classId, cost, scheduleItems } = request.body;

            // console.log({
            //     userId,
            //     classId,
            //     cost,
            //     scheduleItems
            // })

            // return
            //const parsedCost = parseFloat(cost); // Convert cost from string to number

            const createdAvailabilities = [];

            for (const item of scheduleItems) {


                const isAvailabilityAlreadyCreated = await prisma.availability.findFirst({
                    where: {
                        userId,
                        classId: classId,
                        day: item.week_day,
                        startTime: item.from,
                        endTime: item.to,
                    },
                });

                if (isAvailabilityAlreadyCreated) {
                    console.log('Já existe uma availability assim: ' + JSON.stringify(isAvailabilityAlreadyCreated));
                    throw new Error('Exact availability found.');
                }

                const availability = await prisma.availability.create({
                    data: {
                        day: item.week_day,
                        startTime: item.from,
                        endTime: item.to,
                        cost: cost,
                        userId,
                        classId: classId,
                    },
                });

                createdAvailabilities.push(availability);
            }

            return reply.status(201).send();
        });
}

// Helper function to convert time in HH:mm format to minutes
function convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
