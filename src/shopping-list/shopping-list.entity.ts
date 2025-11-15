import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {MealPlan} from "../meal-plan/meal-plan.entity";
import {User} from "../user/user.entity";

@Entity()
export class ShoppingList {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    shoppingDay: number;

    @Column('simple-array')
    validForDays: number[];

    @Column('text')
    items: string; // JSON stringified array of items

    @Column({ default: false })
    isPinned: boolean;

    @ManyToOne(() => MealPlan, (mealPlan) => mealPlan.shoppingLists, { onDelete: 'CASCADE' })
    mealPlan: MealPlan;

    @ManyToOne(() => User, (user) => user.shoppingLists)
    user: User;
}

