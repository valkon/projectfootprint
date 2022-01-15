"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasketResolver = void 0;
const Basket_1 = require("../entities/Basket");
const type_graphql_1 = require("type-graphql");
let BasketResolver = class BasketResolver {
    baskets({ em }) {
        return em.find(Basket_1.Basket, {});
    }
    basket(id, { em }) {
        return em.findOne(Basket_1.Basket, { id });
    }
    async createBasket(footprint, { em }) {
        const basket = em.create(Basket_1.Basket, { footprint });
        await em.persistAndFlush(basket);
        return basket;
    }
    async deleteBasket(id, { em }) {
        await em.nativeDelete(Basket_1.Basket, { id });
        return id;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Basket_1.Basket]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BasketResolver.prototype, "baskets", null);
__decorate([
    (0, type_graphql_1.Query)(() => Basket_1.Basket, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BasketResolver.prototype, "basket", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Basket_1.Basket, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('footprint', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BasketResolver.prototype, "createBasket", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Basket_1.Basket, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BasketResolver.prototype, "deleteBasket", null);
BasketResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BasketResolver);
exports.BasketResolver = BasketResolver;
//# sourceMappingURL=basket.js.map