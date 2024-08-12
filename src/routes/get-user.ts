import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getUser(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/get-user', {
            schema: {
                summary: 'Get a user by email and password',
                tags: ['User'],
                body: z.object({
                    email: z.string().email(),
                    password: z.string(),
                }),
                response: {
                    200: z.union([
                        z.object({
                            userData: z.object({
                                userId: z.string().uuid(),
                                name: z.string(),
                                avatar: z.string(),
                                whatsapp: z.string(),
                                bio: z.string(),
                                email: z.string(),
                                instagram: z.string().nullable(),
                                facebook: z.string().nullable(),
                                youtube: z.string().nullable(),
                            })
                        }),
                        z.object({
                            message: z.string(),
                        })
                    ])
                },
            },
        }, async (request, reply) => {
            const { email, password } = request.body;

            // Find the user by email
            const user = await prisma.user.findUnique({
                where: {
                    email,
                }
            });

            // Check if the user exists
            if (!user) {
                return reply.status(404).send({ message: 'User not found' });
            }

            // Check if the password matches
            if (password !== user.password) {
                return reply.status(401).send({ message: 'Invalid password' });
            }

            // Return the user data
            return reply.status(200).send({
                userData: {
                    userId: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    whatsapp: user.whatsapp,
                    bio: user.bio,
                    email: user.email,
                    instagram: user.instagram,
                    facebook: user.facebook,
                    youtube: user.youtube,
                }
            });
        });
}
