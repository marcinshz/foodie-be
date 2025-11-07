import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {MealPlan} from "./meal-plan.entity";
import {SaveMealPlanDto} from "./dtos/save-meal-plan.dto";
import {UserService} from "../user/user.service";

@Injectable()
export class MealPlanService {
    constructor(@InjectRepository(MealPlan)
                private mealPlanRepository: Repository<MealPlan>,
                private readonly userService: UserService
    ) {
    }

    async saveMealPlan(saveMealPlanDto: SaveMealPlanDto): Promise<MealPlan> {
        const user = await this.userService.findUserById(saveMealPlanDto.userId);
        if (!user) throw new Error('User not found');
        const data = {
            ...saveMealPlanDto,
            dailyTargets: saveMealPlanDto.dailyTargets ? JSON.stringify(saveMealPlanDto.dailyTargets) : null,
            plan: JSON.stringify(saveMealPlanDto.plan),
            user,
        };
        const mealPlan = this.mealPlanRepository.create(data);
        return await this.mealPlanRepository.save(mealPlan);
    }

    async deleteMealPlan(id: string): Promise<MealPlan> {
        const mealPlan = await this.mealPlanRepository.findOneBy({id});
        if (!mealPlan) throw new Error('Meal plan not found');
        return await this.mealPlanRepository.remove(mealPlan);
    }

    async getUserMealPlans(userId: string): Promise<any[]> {
        const mealPlans = await this.mealPlanRepository.find({
            where: {
                user: {
                    id: userId
                }
            }
        });
        
        return mealPlans.map((mealPlan) => {
            try {
                const parsed: any = {
                    id: mealPlan.id,
                    title: mealPlan.title,
                    description: mealPlan.description,
                    days: mealPlan.days,
                    mealsPerDay: mealPlan.mealsPerDay,
                    servings: mealPlan.servings,
                    dailyTargets: mealPlan.dailyTargets ? JSON.parse(mealPlan.dailyTargets) : undefined,
                    plan: JSON.parse(mealPlan.plan)
                };
                return parsed;
            } catch (error) {
                console.error('Error parsing meal plan:', error);
                return null;
            }
        }).filter(mp => mp !== null);
    }

    async getMealPlan(id: string): Promise<any> {
        const mealPlan = await this.mealPlanRepository.findOneBy({id});
        if (!mealPlan) throw new Error('Meal plan not found');
        
        return {
            id: mealPlan.id,
            title: mealPlan.title,
            description: mealPlan.description,
            days: mealPlan.days,
            mealsPerDay: mealPlan.mealsPerDay,
            servings: mealPlan.servings,
            dailyTargets: mealPlan.dailyTargets ? JSON.parse(mealPlan.dailyTargets) : undefined,
            plan: JSON.parse(mealPlan.plan)
        };
    }

    async updateMealPlan(id: string, updateData: any): Promise<any> {
        const mealPlan = await this.mealPlanRepository.findOneBy({id});
        if (!mealPlan) throw new Error('Meal plan not found');

        // Update the meal plan fields
        mealPlan.title = updateData.title;
        mealPlan.description = updateData.description;
        mealPlan.days = updateData.days;
        mealPlan.mealsPerDay = updateData.mealsPerDay;
        mealPlan.servings = updateData.servings;
        mealPlan.dailyTargets = updateData.dailyTargets ? JSON.stringify(updateData.dailyTargets) : null;
        mealPlan.plan = JSON.stringify(updateData.plan);

        const savedMealPlan = await this.mealPlanRepository.save(mealPlan);
        
        return {
            id: savedMealPlan.id,
            title: savedMealPlan.title,
            description: savedMealPlan.description,
            days: savedMealPlan.days,
            mealsPerDay: savedMealPlan.mealsPerDay,
            servings: savedMealPlan.servings,
            dailyTargets: savedMealPlan.dailyTargets ? JSON.parse(savedMealPlan.dailyTargets) : undefined,
            plan: JSON.parse(savedMealPlan.plan)
        };
    }
}

