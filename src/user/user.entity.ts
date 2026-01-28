import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Recipe} from "../recipe/recipe.entity";
import {MealPlan} from "../meal-plan/meal-plan.entity";
import {ShoppingList} from "../shopping-list/shopping-list.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(() => Recipe, recipe => recipe.user)
    recipes: Recipe[];

    @OneToMany(() => MealPlan, mealPlan => mealPlan.user)
    mealPlans: MealPlan[];

    @OneToMany(() => ShoppingList, shoppingList => shoppingList.user)
    shoppingLists: ShoppingList[];
}