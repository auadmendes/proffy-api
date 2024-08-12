import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";


export async function getUsers(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/users', (request, reply) => {
            console.log(request.body)
            const users = [
                {name: 'Luciano', age: 39 },
                {name: 'Jaquelaine', age: 37 },
            ]

            return reply.send({users})

        })
}