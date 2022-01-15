import { Migration } from '@mikro-orm/migrations';

export class Migration20220113104540 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "basket" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "footprint" int4 not null);');
  }

}
