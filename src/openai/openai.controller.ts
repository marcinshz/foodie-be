import {Body, Controller, Post} from '@nestjs/common';
import {OpenaiService} from "./openai.service";
import {SingleDishInputDto} from "./dtos/single-dish-input.dto";
import {SingleDishOutputDto} from "./dtos/single-dish-output.dto";
import {ImageDto} from "./dtos/image.dto";
import {MealPlanInputDto} from "./dtos/meal-plan-input.dto";
import {MealPlanOutputDto} from "./dtos/meal-plan-output.dto";

@Controller('openai')
export class OpenaiController {
    constructor(private openaiService: OpenaiService) {
    }

    @Post('single-dish-default')
    async getSingleDishDefault(@Body() singleDishInput: SingleDishInputDto): Promise<SingleDishOutputDto> {
        return await this.openaiService.generateSingleDishDefault(singleDishInput);
    }

    @Post('single-dish-image')
    async getSingleDishImage(@Body() singleDishInput: SingleDishOutputDto): Promise<ImageDto> {
        return this.openaiService.generateDishImage(singleDishInput);
    }

    @Post('meal-plan-default')
    async getMealPlanDefault(@Body() mealPlanInput: MealPlanInputDto): Promise<MealPlanOutputDto> {
        return await this.openaiService.generateMealPlanDefault(mealPlanInput);
    }
}
