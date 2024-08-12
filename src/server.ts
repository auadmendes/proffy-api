import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifyCors from '@fastify/cors';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { getUsers } from './routes/get-users'
import { createUser } from './routes/create-user'
import { createClasses } from './routes/create-classes'
import { createAvailability } from './routes/create-availability'
import { getAvailability } from './routes/get-availability'
import { createConnection } from './routes/create-connections'
import { getAllClasses } from './routes/get-class'
import { getConnectionCount } from './routes/get-connections'
import { getUser } from './routes/get-user';



const app = fastify()

app.register(fastifyCors, {
    origin: '*', // em produção isso precisa ter exatamente o endereço que vai acessar
})

app.register(fastifySwagger, {
    swagger: {
        consumes: ['application/json'],
        produces: ['application/json'],
        info: {
            title: 'api proffy',
            description: 'API para o App proffy',
            version: '1.0.0   '
        },
    },
    transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
    routePrefix: "/docs"
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(getUsers)
app.register(createUser)
app.register(createClasses)
app.register(createAvailability)
app.register(getAvailability)
app.register(createConnection)
app.register(getAllClasses)
app.register(getConnectionCount)
app.register(getUser)


app.listen({ port: 4444}).then( () => {
    console.log('Server Proffy running on port 4444')
})