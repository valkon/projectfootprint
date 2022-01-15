import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType, Int } from 'type-graphql';

//you can stack decorators to make something both a graphql object type, and an entity
@ObjectType()
@Entity()
export class User { 

  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  //@Field is the Graphql property, you need to add return type for typegraphql
  //the 'type' property defines the postgres datatype used by the migration to generate sql
  @Field(() => String)
  @Property({type: 'date'})
  createdAt = new Date();

  @Field(() => String)
  @Property({type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  //If you comment out a @Field, you won't expose that data in graphQL 
  @Field(() => String)
  @Property({ type: 'text', unique:true })
  email!: string;

  //Field property not on password so it isn't exposed to Graphql
  @Property({ type: 'text'})
  password!: string;

}