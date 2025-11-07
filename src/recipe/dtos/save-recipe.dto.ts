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
    @ApiProperty({ description: 'Estimated cooking time in minutes' })
    estimatedTime: number;
    @ApiProperty({ description: 'Number of portions the recipe makes' })
    servings: number;
    @ApiProperty({ description: 'Calories per single serving in kcal' })
    calories: number;
    @ApiProperty({
        description: 'Macronutrients per single serving',
        type: 'object',
        properties: {
            protein: { type: 'number', description: 'Protein per serving in grams' },
            fat: { type: 'number', description: 'Fat per serving in grams' },
            carbs: { type: 'number', description: 'Carbs per serving in grams' }
        }
    })
    macros: {
        protein: number;
        fat: number;
        carbs: number;
    };
    @ApiProperty()
    difficulty: string;
}