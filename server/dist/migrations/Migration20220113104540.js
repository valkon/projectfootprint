"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220113104540 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220113104540 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "basket" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "footprint" int4 not null);');
    }
}
exports.Migration20220113104540 = Migration20220113104540;
//# sourceMappingURL=Migration20220113104540.js.map