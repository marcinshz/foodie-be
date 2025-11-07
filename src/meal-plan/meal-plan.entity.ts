import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/user.entity";

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
    @Column({ type: 'text', nullable: true })
    dailyTargets: string; // JSON stringified
    @Column('text')
    plan: string; // JSON stringified

    @ManyToOne(() => User, (user) => user.mealPlans)
    user: User;
}

