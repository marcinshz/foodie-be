import {Injectable} from '@nestjs/common';
import OpenAIApi from 'openai';
import {ConfigService} from "@nestjs/config";
import {defaultConfig} from "./model.configurations";
import {SingleDishInputDto} from "./dtos/single-dish-input.dto";
import {singleDishInstruction, mealPlanInstruction, mealPlanInstructionStep1, mealPlanInstructionStep2} from "./model.instructions";
import {SingleDishOutputDto} from "./dtos/single-dish-output.dto";
import {MealPlanInputDto} from "./dtos/meal-plan-input.dto";
import {MealPlanOutputDto} from "./dtos/meal-plan-output.dto";

@Injectable()
export class OpenaiService {
    private openai: OpenAIApi;

    constructor(private configService: ConfigService) {
        this.openai = new OpenAIApi({
            apiKey: process.env.OPEN_AI_SECRET_KEY,
        });
    }

    async generateSingleDishDefault(input: SingleDishInputDto): Promise<SingleDishOutputDto> {
        const startTime = Date.now();
        console.log('🍽️  Generating single dish...');
        
        const response = await this.openai.responses.create(defaultConfig(input, singleDishInstruction));
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`✅ Single dish generated in ${duration}ms (${(duration / 1000).toFixed(2)}s)`);
        
        return JSON.parse(response.output_text);
    }

    async generateMealPlanDefault(input: MealPlanInputDto): Promise<MealPlanOutputDto> {
        const startTime = Date.now();
        console.log('📅 Generating meal plan (single prompt approach)...');
        
        const response = await this.openai.responses.create(defaultConfig(input, mealPlanInstruction));
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`✅ Meal plan generated in ${duration}ms (${(duration / 1000).toFixed(2)}s)`);
        
        try {
            return JSON.parse(response.output_text);
        } catch (error) {
            console.error('Failed to parse meal plan response:', error);
            console.error('Raw response:', response.output_text);
            throw new Error(`Invalid JSON response from AI: ${error.message}`);
        }
    }

    async generateMealPlanMultistep(input: MealPlanInputDto): Promise<MealPlanOutputDto> {
        const totalStartTime = Date.now();
        console.log('📅 Generating meal plan (multi-step approach)...');
        
        // Step 1: Generate meal plan without shopping lists
        const step1StartTime = Date.now();
        console.log('  ⏳ Step 1: Generating meal plan...');
        const step1Response = await this.openai.responses.create(defaultConfig(input, mealPlanInstructionStep1));
        const step1EndTime = Date.now();
        const step1Duration = step1EndTime - step1StartTime;
        
        let mealPlan: Partial<MealPlanOutputDto>;
        try {
            mealPlan = JSON.parse(step1Response.output_text);
            console.log(`  ✅ Step 1 completed in ${step1Duration}ms (${(step1Duration / 1000).toFixed(2)}s)`);
        } catch (error) {
            console.error('Failed to parse meal plan response (Step 1):', error);
            console.error('Raw response:', step1Response.output_text);
            throw new Error(`Invalid JSON response from AI (Step 1): ${error.message}`);
        }

        // Step 2: Generate shopping lists based on the meal plan
        const step2StartTime = Date.now();
        console.log('  ⏳ Step 2: Generating shopping lists...');


        const step2Input = {
            mealPlan:mealPlan,
            shoppingFrequencyDays: input.shoppingFrequencyDays,
            days: input.days,
        };
        
        const step2Response = await this.openai.responses.create(defaultConfig(step2Input, mealPlanInstructionStep2));
        const step2EndTime = Date.now();
        const step2Duration = step2EndTime - step2StartTime;
        
        let shoppingListsResult: { shoppingLists: any[] };
        try {
            shoppingListsResult = JSON.parse(step2Response.output_text);
            console.log(`  ✅ Step 2 completed in ${step2Duration}ms (${(step2Duration / 1000).toFixed(2)}s)`);
        } catch (error) {
            console.error('Failed to parse shopping lists response (Step 2):', error);
            console.error('Raw response:', step2Response.output_text);
            throw new Error(`Invalid JSON response from AI (Step 2): ${error.message}`);
        }

        // Combine results
        const finalResult: MealPlanOutputDto = {
            ...mealPlan,
            shoppingLists: shoppingListsResult.shoppingLists,
        } as MealPlanOutputDto;

        const totalEndTime = Date.now();
        const totalDuration = totalEndTime - totalStartTime;
        console.log(`✅ Total multi-step generation completed in ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);

        return finalResult;
    }

    async generateMealPlanCyclic(input: MealPlanInputDto): Promise<MealPlanOutputDto> {
        const totalStartTime = Date.now();
        const totalDays = input.days || 7;
        const shoppingFrequency = input.shoppingFrequencyDays || 7;
        const numberOfCycles = Math.ceil(totalDays / shoppingFrequency);
        
        console.log(`🔄 Generating meal plan (cyclic approach)...`);
        console.log(`   📊 Total days: ${totalDays}, Shopping frequency: ${shoppingFrequency} days, Cycles: ${numberOfCycles}`);

        const cycleResults: MealPlanOutputDto[] = [];

        for (let cycle = 0; cycle < numberOfCycles; cycle++) {
            const cycleStartTime = Date.now();
            const dayOffset = cycle * shoppingFrequency;
            const remainingDays = totalDays - dayOffset;
            const cycleDays = Math.min(shoppingFrequency, remainingDays);
            
            console.log(`  🔁 Cycle ${cycle + 1}/${numberOfCycles}: Generating days ${dayOffset + 1}-${dayOffset + cycleDays}...`);

            // Create input for this cycle
            const cycleInput: MealPlanInputDto = {
                ...input,
                days: cycleDays,
                shoppingFrequencyDays: cycleDays, // Each cycle is one shopping period
            };

            // Generate meal plan for this cycle using multi-step approach
            const cycleResult = await this.generateMealPlanMultistep(cycleInput);
            
            // Adjust day numbers for cycles after the first
            if (cycle > 0) {
                // Adjust plan day numbers
                cycleResult.plan = cycleResult.plan.map(dayPlan => ({
                    ...dayPlan,
                    day: dayPlan.day + dayOffset,
                }));

                // Adjust shopping list day numbers
                if (cycleResult.shoppingLists) {
                    cycleResult.shoppingLists = cycleResult.shoppingLists.map(shoppingList => ({
                        ...shoppingList,
                        shoppingDay: shoppingList.shoppingDay + dayOffset,
                        validForDays: shoppingList.validForDays.map(day => day + dayOffset),
                        items: shoppingList.items.map(item => ({
                            ...item,
                            usedInDays: item.usedInDays.map(day => day + dayOffset),
                        })),
                    }));
                }
            }

            cycleResults.push(cycleResult);
            
            const cycleEndTime = Date.now();
            const cycleDuration = cycleEndTime - cycleStartTime;
            console.log(`  ✅ Cycle ${cycle + 1} completed in ${cycleDuration}ms (${(cycleDuration / 1000).toFixed(2)}s)`);
        }

        // Merge all cycles into one meal plan
        console.log('  🔗 Merging cycles...');
        const mergedResult: MealPlanOutputDto = {
            title: 'Your Meal Plan',
            description: '',
            days: totalDays,
            mealsPerDay: cycleResults[0].mealsPerDay,
            servings: cycleResults[0].servings,
            dailyTargets: cycleResults[0].dailyTargets,
            plan: cycleResults.flatMap(cycle => cycle.plan),
            shoppingLists: cycleResults.flatMap(cycle => cycle.shoppingLists || []),
        };

        const totalEndTime = Date.now();
        const totalDuration = totalEndTime - totalStartTime;
        console.log(`✅ Cyclic meal plan generation completed in ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);

        return mergedResult;
    }
}
