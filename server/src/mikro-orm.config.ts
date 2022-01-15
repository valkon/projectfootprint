import { __prod__ } from "./constants";
import { Basket } from "./entities/Basket";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname,"./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    disableForeignKeys: false
  },
  dbName: "foodprint",
  entities: [Basket, User],
  user: "valkon",
  password: "830234vk",
  type: "postgresql",
  //set environment variable to only have debugging in dev mode
  debug: !__prod__
} as Parameters<typeof MikroORM.init>[0];

