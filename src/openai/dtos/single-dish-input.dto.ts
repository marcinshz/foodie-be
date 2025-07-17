import {ApiProperty} from "@nestjs/swagger";

export class SingleDishInputDto {
    @ApiProperty()
    ingredients?: Array<string>;
    @ApiProperty()
    cuisine?: Array<string>;
    @ApiProperty()
    time?: number;
    @ApiProperty()
    difficulty?: string;
    @ApiProperty()
    servings?: number;
    @ApiProperty()
    mealType?: string;
    @ApiProperty()
    dietType?: string;
    @ApiProperty()
    calories?: number;
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