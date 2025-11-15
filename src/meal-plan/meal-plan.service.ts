import {Injectable, Inject, forwardRef} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {MealPlan} from "./meal-plan.entity";
import {SaveMealPlanDto} from "./dtos/save-meal-plan.dto";
import {UserService} from "../user/user.service";
import {ShoppingListService} from "../shopping-list/shopping-list.service";

@Injectable()
export class MealPlanService {
    constructor(
        @InjectRepository(MealPlan)
        private mealPlanRepository: Repository<MealPlan>,
        private readonly userService: UserService,
        @Inject(forwardRef(() => ShoppingListService))
        private readonly shoppingListService: ShoppingListService
    ) {
    }

    async saveMealPlan(saveMealPlanDto: SaveMealPlanDto): Promise<any> {
        const user = await this.userService.findUserById(saveMealPlanDto.userId);
        if (!user) throw new Error('User not found');
        
        const data = {
            title: saveMealPlanDto.title,
            description: saveMealPlanDto.description,
            days: saveMealPlanDto.days,
            mealsPerDay: saveMealPlanDto.mealsPerDay,
            servings: saveMealPlanDto.servings,
            dailyTargets: saveMealPlanDto.dailyTargets ? JSON.stringify(saveMealPlanDto.dailyTargets) : null,
            plan: JSON.stringify(saveMealPlanDto.plan),
            user,
        };
        
        const mealPlan = this.mealPlanRepository.create(data);
        const savedMealPlan = await this.mealPlanRepository.save(mealPlan);
        
        // Save shopping lists separately if they exist
        let shoppingLists = [];
        if (saveMealPlanDto.shoppingLists && saveMealPlanDto.shoppingLists.length > 0) {
            shoppingLists = await this.shoppingListService.createShoppingListsForMealPlan(
                saveMealPlanDto.shoppingLists,
                savedMealPlan,
                saveMealPlanDto.userId
            );
        }
        
        // Return complete meal plan with shopping lists
        return {
            id: savedMealPlan.id,
            title: savedMealPlan.title,
            description: savedMealPlan.description,
            days: savedMealPlan.days,
            mealsPerDay: savedMealPlan.mealsPerDay,
            servings: savedMealPlan.servings,
            dailyTargets: savedMealPlan.dailyTargets ? JSON.parse(savedMealPlan.dailyTargets) : undefined,
            plan: JSON.parse(savedMealPlan.plan),
            shoppingLists: shoppingLists.map(sl => ({
                id: sl.id,
                shoppingDay: sl.shoppingDay,
                validForDays: sl.validForDays,
                items: JSON.parse(sl.items),
                isPinned: sl.isPinned
            }))
        };
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
        
        const results = [];
        for (const mealPlan of mealPlans) {
            try {
                const shoppingLists = await this.shoppingListService.getShoppingListsByMealPlan(mealPlan.id);
                
                const parsed: any = {
                    id: mealPlan.id,
                    title: mealPlan.title,
                    description: mealPlan.description,
                    days: mealPlan.days,
                    mealsPerDay: mealPlan.mealsPerDay,
                    servings: mealPlan.servings,
                    dailyTargets: mealPlan.dailyTargets ? JSON.parse(mealPlan.dailyTargets) : undefined,
                    plan: JSON.parse(mealPlan.plan),
                    shoppingLists: shoppingLists
                };
                results.push(parsed);
            } catch (error) {
                console.error('Error parsing meal plan:', error);
            }
        }
        return results;
    }

    async getMealPlan(id: string): Promise<any> {
        const mealPlan = await this.mealPlanRepository.findOneBy({id});
        if (!mealPlan) throw new Error('Meal plan not found');
        
        const shoppingLists = await this.shoppingListService.getShoppingListsByMealPlan(id);
        
        return {
            id: mealPlan.id,
            title: mealPlan.title,
            description: mealPlan.description,
            days: mealPlan.days,
            mealsPerDay: mealPlan.mealsPerDay,
            servings: mealPlan.servings,
            dailyTargets: mealPlan.dailyTargets ? JSON.parse(mealPlan.dailyTargets) : undefined,
            plan: JSON.parse(mealPlan.plan),
            shoppingLists: shoppingLists
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
        
        // Get shopping lists (they remain unchanged when dish is replaced)
        const shoppingLists = await this.shoppingListService.getShoppingListsByMealPlan(id);
        
        return {
            id: savedMealPlan.id,
            title: savedMealPlan.title,
            description: savedMealPlan.description,
            days: savedMealPlan.days,
            mealsPerDay: savedMealPlan.mealsPerDay,
            servings: savedMealPlan.servings,
            dailyTargets: savedMealPlan.dailyTargets ? JSON.parse(savedMealPlan.dailyTargets) : undefined,
            plan: JSON.parse(savedMealPlan.plan),
            shoppingLists: shoppingLists
        };
    }
}

