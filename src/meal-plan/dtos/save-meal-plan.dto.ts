import {ApiProperty} from "@nestjs/swagger";

export class SaveMealPlanDto {
    @ApiProperty()
    userId: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    days: number;
    @ApiProperty()
    mealsPerDay: number;
    @ApiProperty({ description: 'Number of people this meal plan serves' })
    servings: number;
    @ApiProperty({ required: false })
    dailyTargets?: {
        calories?: number;
        protein?: number;
        fat?: number;
        carbs?: number;
    };
    @ApiProperty()
    plan: Array<{
        day: number;
        estimatedTime: number;
        totals: {
            calories: number;
            protein: number;
            fat: number;
            carbs: number;
        };
        meals: Array<{
            type: string;
            dish: {
                title: string;
                cuisine: string;
                description: string;
                ingredients: Array<string>;
                instructions: Array<string>;
                estimatedTime: number;
                servings: number;
                calories: number;
                macros: {
                    protein: number;
                    fat: number;
                    carbs: number;
                };
                difficulty: string;
            };
        }>;
    }>;
}

