const express = require('express');
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import  mikroConfig  from "./mikro-orm.config";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { BasketResolver } from "./resolvers/basket";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
const session = require('express-session');
const cors = require('cors');
//TODO: Get dotenv working
// require('dotenv').config({path: path + '../src/.env'});
const app = express();
const PORT = 4000;
const SECRET = 'strangelove';



app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);
app.use(
  session({
    // the store property, if not specified, defaults to the in-memory store
    name: 'qid',
    saveUninitialized: false,
    resave: false,
    secret: SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1hr
      sameSite: false,
      //this defines whether you can access cookie in frontend
      httpOnly: false,
      // we would want to set secure=true in a production environment
      secure: false,
    },
  })
);

(async function () {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();
  // const basket = orm.em.create(Basket, {footprint: 23});
  // await orm.em.persistAndFlush(basket);
  // const baskets = await orm.em.find(Basket, {});

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [BasketResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }): MyContext => ({ 
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
  })} catch (err) {
    console.error(err);
  }
})();

