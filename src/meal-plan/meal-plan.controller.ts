import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {MealPlanService} from "./meal-plan.service";
import {SaveMealPlanDto} from "./dtos/save-meal-plan.dto";

@Controller('meal-plan')
export class MealPlanController {
    constructor(private readonly mealPlanService: MealPlanService) {
    }

    @Post()
    saveMealPlan(@Body() saveMealPlanDto: SaveMealPlanDto) {
        return this.mealPlanService.saveMealPlan(saveMealPlanDto);
    }

    @Delete('/:id')
    deleteMealPlan(@Param('id') id: string) {
        return this.mealPlanService.deleteMealPlan(id);
    }

    @Get('/by-user/:userId')
    getUserMealPlans(@Param('userId') userId: string) {
        return this.mealPlanService.getUserMealPlans(userId);
    }

    @Get('/:id')
    getMealPlan(@Param('id') id: string) {
        return this.mealPlanService.getMealPlan(id);
    }

    @Put('/:id')
    updateMealPlan(@Param('id') id: string, @Body() updateData: any) {
        return this.mealPlanService.updateMealPlan(id, updateData);
    }
}

