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
    @Column('json')
    ingredients: any;
    @Column('json')
    instructions: any;
    @Column()
    estimatedTime: number;
    @Column()
    servings: number;
    @Column()
    calories: number;
    @Column('json')
    macros: any;
    @Column()
    difficulty: string;

    @ManyToOne(() => User, (user) => user.recipes)
    user: User;
}