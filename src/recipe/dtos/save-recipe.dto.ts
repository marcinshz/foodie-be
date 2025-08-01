import {ApiProperty} from "@nestjs/swagger";

export class SaveRecipeDto {
    @ApiProperty()
    userId: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    cuisine: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    ingredients: Array<string>;
    @ApiProperty()
    instructions: Array<string>;
    @ApiProperty()
    estimatedTime: number;
    @ApiProperty()
    servings: number;
    @ApiProperty()
    calories: number;
    @ApiProperty()
    macros: {
        protein: number;
        fat: number;
        carbs: number;
    };
    @ApiProperty()
    difficulty: string;
}