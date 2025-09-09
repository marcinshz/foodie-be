import {ApiProperty} from "@nestjs/swagger";

export class MealPlanInputDto {
    @ApiProperty()
    days?: number;
    @ApiProperty()
    mealsPerDay?: number;
    @ApiProperty()
    mealTypes?: Array<string>;
    @ApiProperty()
    ingredients?: Array<string>;
    @ApiProperty()
    cuisine?: Array<string>;
    @ApiProperty()
    timePerDay?: number;
    @ApiProperty()
    difficulty?: string;
    @ApiProperty()
    servings?: number;
    @ApiProperty()
    dietType?: string;
    @ApiProperty()
    caloriesPerDay?: number;
    @ApiProperty()
    highProtein?: boolean;
    @ApiProperty()
    lowFat?: boolean;
    @ApiProperty()
    lowCarbs?: boolean;
    @ApiProperty()
    blacklistedIngredients?: Array<string>;
    @ApiProperty()
    allergens?: Array<string>;
}
