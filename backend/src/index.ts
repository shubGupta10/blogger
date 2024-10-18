import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from "@apollo/server/express4";
import cors from 'cors';
import express from 'express';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import mergedResolvers from './resolvers/mergedResolvers.js';
import mergedTypeDefs from './typeDefs/mergedTypeDefs.js';
import connect from './DbConfig/Connect.js';
import authMiddleware from './Middlewares/authMiddlewares.js';
import dotenv from 'dotenv';

dotenv.config();

interface MyContext {
    user?: any; 
    req: express.Request;
    res: express.Response;
}

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(cors({
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

app.use(expressMiddleware(server, {
    context: async ({ req, res }) => {
        const user = await authMiddleware(req, res);
        console.log("ye mera index.ts wala", user); 
        return { req, res, user } as MyContext;
    }
}));

const PORT = process.env.PORT || 4000; 
await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
await connect();
console.log(`🚀 Server ready at http://localhost:${PORT}/`);
