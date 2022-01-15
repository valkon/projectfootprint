import { User } from '../entities/User';
import { Query, Resolver, Ctx, Arg, Int, Mutation, InputType, Field, ObjectType } from 'type-graphql';
import { MyContext } from 'src/types';
import argon2 from 'argon2';
import { validateEmail } from '../utils/helperfunctions.js';

@InputType()
class EmailPasswordInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

//Use this to create a user friendly error message when somthing is wrong with a field - eg wrong username or wrong password
@ObjectType() 
  class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
  }

//This means we either return an error array or a user object 
@ObjectType() 
  class UserResponse {
    @Field(() => [FieldError], { nullable: true }) 
    errors?: [FieldError];

    @Field(() => User, { nullable: true })
    user?: User;
  }


@Resolver()
export class UserResolver {

  //Outside the function arguments are typescript types, inside are GraphQl types
  @Query(() => User, { nullable: true }) 
  FindUser(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    return em.findOne(User, { id });
  }

  //Authentication query
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  //Create new user if one doesn't exist
  @Mutation(() => UserResponse) 
  async register(
    @Arg('options') options: EmailPasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const valid = validateEmail(options.email);
    if (!valid) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Please enter a valid email address'
          }
        ]
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, { email: options.email.toLowerCase(), password: hashedPassword });
    try {
      await em.persistAndFlush(user);
      req.session.userId = user.id;
      return { user };
      // if this fails due to existing user we need to return a user-friendly error message
    } catch (err) {
      if (err.code === '23505' || err.detail.includes('already exists')) {
        // duplicate username error
        return {
          errors: [
            {
              field: 'email',
              message: 'An account with this username already exists'
            }
          ] 
        };
      }
      return { errors: [
        {
          field: 'email',
          message: 'There was an error creating the account. Please try again'
        }
      ] };
    };
  }


  // Check if user exists, if password is correct and either return an array of errors or a user object, defined by User Response Object Type
  @Mutation(() => UserResponse, { nullable: true }) 
  async login(
    @Arg('options') options: EmailPasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { email: options.email.toLowerCase()});
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "There is no account for this email"
          }
        ]
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    
    if (!valid) {
      return { 
        errors: [
          {
            field: "password",
            message: "That password is incorrect"
          }
        ]
      }
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => User, { nullable: true }) 
  async deleteUser(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try { 
      await em.nativeDelete(User, { id });
      return true;
    } catch {
      return false;
    }
  }
}  