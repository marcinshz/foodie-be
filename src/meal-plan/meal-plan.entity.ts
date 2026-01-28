import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/user.entity";
import {ShoppingList} from "../shopping-list/shopping-list.entity";

@Entity()
export class MealPlan {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    title: string;
    @Column()
    description: string;
    @Column()
    days: number;
    @Column()
    mealsPerDay: number;
    @Column()
    servings: number;
    @Column({ type: 'json', nullable: true })
    dailyTargets: any;
    @Column('json')
    plan: any;

    @ManyToOne(() => User, (user) => user.mealPlans)
    user: User;

    @OneToMany(() => ShoppingList, (shoppingList) => shoppingList.mealPlan, { cascade: true })
    shoppingLists: ShoppingList[];
}

