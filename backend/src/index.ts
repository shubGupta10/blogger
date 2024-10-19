import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from "@apollo/server/express4";
import cors from 'cors';
import express from 'express';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import mergedResolvers from './resolvers/mergedResolvers.js';
import mergedTypeDefs from './typeDefs/mergedTypeDefs.js';
import connect from './DbConfig/Connect.js';
import authMiddleware, { AuthenticatedRequest } from './Middlewares/authMiddlewares.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

interface MyContext {
    user?: any;
    req: AuthenticatedRequest;
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

const corsOptions = {
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Use authMiddleware as regular Express middleware
app.use(authMiddleware());

app.use('/graphql', expressMiddleware(server, {
    context: async ({ req, res }) => {
        return { req: req as AuthenticatedRequest, res, user: (req as AuthenticatedRequest).user } as MyContext;
    }
}));

const PORT = process.env.PORT || 4000;

await connect(); // Ensure this connects successfully

await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);