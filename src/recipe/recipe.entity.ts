import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/user.entity";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    title: string;
    @Column()
    cuisine: string;
    @Column()
    description: string;
    @Column()
    ingredients: string;
    @Column()
    instructions: string;
    @Column()
    estimatedTime: number;
    @Column()
    servings: number;
    @Column()
    calories: number;
    @Column()
    macros: string;
    @Column()
    difficulty: string;

    @ManyToOne(() => User, (user) => user.recipes)
    user: User;
}