import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function createUser(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/create-user', {
            schema: {
                summary: 'Create a user',
                tags: ['User'],
                body: z.object({
                    name: z.string().min(4),
                    avatar: z.string(),
                    whatsapp: z.string(),
                    bio: z.string(),
                    email: z.string().email(),
                    password: z.string(),
                    instagram: z.string().nullable(),
                    facebook: z.string().nullable(),
                    youtube: z.string().nullable(),
                }),
                response: {
                    201: z.object({
                        userData: z.object({
                            userId: z.string().uuid(),
                            name: z.string().min(4),
                            avatar: z.string(),
                            whatsapp: z.string(),
                            bio: z.string(),
                            email: z.string(),
                            instagram: z.string().nullable(),
                            facebook: z.string().nullable(),
                            youtube: z.string().nullable(),
                        })
                    })
                },
            },
        }, async (request, reply) => {

            const data = request.body;

            const userEmail = await prisma.user.findUnique({
                where: {
                    email: data.email,
                }
            });

            if(userEmail) {
                throw new Error('Email já cadastrado')  
            }

            const user = await prisma.user.create({
                data: {
                    name: data.name,
                    avatar: data.avatar,
                    whatsapp: data.whatsapp,
                    bio: data.bio,
                    email: data.email,
                    password: data.password,
                    instagram: data.instagram,
                    facebook: data.facebook,
                    youtube: data.youtube,
                }
            });

            return reply.status(201).send({ 
                userData: {
                    userId: user.id,  
                    name: user.name,
                    avatar: user.avatar,
                    whatsapp: user.whatsapp,
                    bio: user.bio,
                    email: user.email,
                    instagram: user.instagram,
                    facebook: user.facebook,
                    youtube: user.youtube
               }
            });
        });
}
