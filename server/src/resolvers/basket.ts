import { Basket } from '../entities/Basket';
import { Query, Resolver, Ctx, Arg, Int, Mutation } from 'type-graphql';
import { MyContext } from 'src/types';

@Resolver()
export class BasketResolver {
  //Query to get all baskets
  @Query(() => [Basket])
  baskets (@Ctx() { em }: MyContext): Promise<Basket[]> {
    return em.find(Basket, {});
  }

  //Outside the function arguments are typescript types, inside are GraphQl types
  @Query(() => Basket, { nullable: true }) 
  basket(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Basket | null> {
    return em.findOne(Basket, { id });
  }

  @Mutation(() => Basket, { nullable: true }) 
  async createBasket(
    @Arg('footprint', () => Int) footprint: number,
    @Ctx() { em }: MyContext
  ): Promise<Basket> {
    const basket = em.create(Basket, { footprint })
    await em.persistAndFlush(basket);
    return basket;
  }

  @Mutation(() => Basket, { nullable: true }) 
  async deleteBasket(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<number> {
    await em.nativeDelete(Basket, { id });
    return id;
  }
}  