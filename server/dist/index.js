"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const basket_1 = require("./resolvers/basket");
const user_1 = require("./resolvers/user");
const session = require('express-session');
const cors = require('cors');
const app = express();
const PORT = 4000;
const SECRET = 'strangelove';
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(session({
    name: 'qid',
    saveUninitialized: false,
    resave: false,
    secret: SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60,
        sameSite: false,
        httpOnly: false,
        secure: false,
    },
}));
(async function () {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    await orm.getMigrator().up();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [basket_1.BasketResolver, user_1.UserResolver],
            validate: false
        }),
        context: ({ req, res }) => ({
            em: orm.em,
            req,
            res
        })
    });
    try {
        await apolloServer.start();
        apolloServer.applyMiddleware({
            app,
            cors: false
        });
        app.listen(PORT, () => {
            console.log('listening on port: ', PORT);
        });
    }
    catch (err) {
        console.error(err);
    }
})();
//# sourceMappingURL=index.js.map