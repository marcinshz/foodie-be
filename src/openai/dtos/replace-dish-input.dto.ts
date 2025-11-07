import {ApiProperty} from "@nestjs/swagger";

export class ReplaceDishInputDto {
    @ApiProperty({ description: 'Meal type to replace (e.g., Breakfast, Lunch, Dinner)' })
    mealType: string;

    @ApiProperty({ description: 'Target calories for this meal' })
    targetCalories?: number;

    @ApiProperty({ description: 'Target protein for this meal' })
    targetProtein?: number;

    @ApiProperty({ description: 'Target fat for this meal' })
    targetFat?: number;

    @ApiProperty({ description: 'Target carbs for this meal' })
    targetCarbs?: number;

    @ApiProperty({ description: 'Number of servings' })
    servings: number;

    @ApiProperty({ description: 'Preferred cuisines', required: false })
    cuisine?: Array<string>;

    @ApiProperty({ description: 'Maximum preparation time in minutes', required: false })
    maxTime?: number;

    @ApiProperty({ description: 'Difficulty level', required: false })
    difficulty?: string;

    @ApiProperty({ description: 'Diet type', required: false })
    dietType?: string;

    @ApiProperty({ description: 'High protein preference', required: false })
    highProtein?: boolean;

    @ApiProperty({ description: 'Low fat preference', required: false })
    lowFat?: boolean;

    @ApiProperty({ description: 'Low carbs preference', required: false })
    lowCarbs?: boolean;

    @ApiProperty({ description: 'Ingredients to avoid', required: false })
    blacklistedIngredients?: Array<string>;

    @ApiProperty({ description: 'Allergens to avoid', required: false })
    allergens?: Array<string>;

    @ApiProperty({ description: 'Current dish title to avoid duplicates', required: false })
    currentDishTitle?: string;
}

