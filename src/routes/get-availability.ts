import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const availabilitySchema = z.object({
  id: z.string().uuid(),
  day: z.number(),
  startTime: z.number(),
  endTime: z.number(),
  cost: z.number(),
  user: z.object({
    id: z.string().uuid(),
    name: z.string(),
    bio: z.string(),
    avatar: z.string(),
    whatsapp: z.string(),
    email: z.string(),
    connectionsCount: z.number(),
  }).nullable(),
  class: z.object({
    id: z.number(),
    subject: z.string(),
  }).nullable(),
});

export async function getAvailability(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/availability', {
      schema: {
        querystring: z.object({
          classId: z.string().optional(),
          weekDay: z.string().optional(),
          classTime: z.string().optional(), // Class time in minutes as a string (e.g., "720")
        }),
        response: {
          200: z.array(availabilitySchema),
        },
      },
    }, async (request, reply) => {
      const { weekDay, classId, classTime } = request.query;

      const whereClause: any = {};

      if (weekDay) whereClause.day = parseInt(weekDay);
      if (classId) whereClause.classId = parseInt(classId);

      // Convert classTime to a number for comparison
      const timeInMinutes = classTime ? parseInt(classTime) : undefined;

      // Fetch availabilities with the condition that startTime is greater than or equal to classTime
      const availabilities = await prisma.availability.findMany({
        where: {
          ...whereClause,
          startTime: {
            gte: timeInMinutes, // Check if startTime is greater than or equal to the provided classTime
          },
        },
        include: {
          user: {
            include: {
              _count: {
                select: { connections: true },
              },
            },
          },
          class: true,
        },
      });

      const responseData = availabilities.map((availability) => ({
        ...availability,
        user: availability.user
          ? {
              ...availability.user,
              connectionsCount: availability.user._count.connections,
            }
          : null,
      }));

      return reply.status(200).send(responseData);
    });
}
