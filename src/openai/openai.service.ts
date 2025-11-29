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

    private formatDuration(ms: number): string {
        return `${ms}ms (${(ms / 1000).toFixed(2)}s)`;
    }

    private parseJsonResponse<T>(responseText: string, context: string): T {
        try {
            return JSON.parse(responseText);
        } catch (error) {
            console.error(`Failed to parse ${context}:`, error);
            console.error('Raw response:', responseText);
            throw new Error(`Invalid JSON response from AI (${context}): ${error.message}`);
        }
    }

    private async timedOperation<T>(
        label: string,
        operation: () => Promise<T>,
        indent = ''
    ): Promise<{ result: T; duration: number }> {
        console.log(`${indent}⏳ ${label}...`);
        const startTime = Date.now();
        const result = await operation();
        const duration = Date.now() - startTime;
        console.log(`${indent}✅ ${label} completed in ${this.formatDuration(duration)}`);
        return { result, duration };
    }

    private adjustDayNumbers(mealPlan: MealPlanOutputDto, offset: number): MealPlanOutputDto {
        return {
            ...mealPlan,
            plan: mealPlan.plan.map(dayPlan => ({
                ...dayPlan,
                day: dayPlan.day + offset,
            })),
            shoppingLists: mealPlan.shoppingLists?.map(list => ({
                ...list,
                shoppingDay: list.shoppingDay + offset,
                validForDays: list.validForDays.map(day => day + offset),
                items: list.items.map(item => ({
                    ...item,
                    usedInDays: item.usedInDays.map(day => day + offset),
                })),
            })),
        };
    }

    async generateSingleDishDefault(input: SingleDishInputDto): Promise<SingleDishOutputDto> {
        console.log('🍽️  Generating single dish...');
        const { result } = await this.timedOperation(
            'Single dish generation',
            async () => {
                const response = await this.openai.responses.create(defaultConfig(input, singleDishInstruction));
                return JSON.parse(response.output_text);
            }
        );
        return result;
    }

    async generateMealPlanDefault(input: MealPlanInputDto): Promise<MealPlanOutputDto> {
        console.log('📅 Generating meal plan (single prompt approach)...');
        const { result } = await this.timedOperation(
            'Meal plan generation',
            async () => {
                const response = await this.openai.responses.create(defaultConfig(input, mealPlanInstruction));
                return this.parseJsonResponse<MealPlanOutputDto>(response.output_text, 'meal plan');
            }
        );
        return result;
    }

    async generateMealPlanMultistep(input: MealPlanInputDto): Promise<MealPlanOutputDto> {
        const startTime = Date.now();
        console.log('📅 Generating meal plan (multi-step approach)...');

        const { result: mealPlan } = await this.timedOperation(
            'Step 1: Generating meal plan',
            async () => {
                const response = await this.openai.responses.create(defaultConfig(input, mealPlanInstructionStep1));
                return this.parseJsonResponse<Partial<MealPlanOutputDto>>(response.output_text, 'Step 1');
            },
            '  '
        );

        const shoppingListInput = {
            mealPlan,
            shoppingFrequencyDays: input.shoppingFrequencyDays,
            days: input.days,
        };

        const { result: shoppingListsResult } = await this.timedOperation(
            'Step 2: Generating shopping lists',
            async () => {
                const response = await this.openai.responses.create(defaultConfig(shoppingListInput, mealPlanInstructionStep2));
                return this.parseJsonResponse<{ shoppingLists: any[] }>(response.output_text, 'Step 2');
            },
            '  '
        );

        console.log(`✅ Total multi-step generation completed in ${this.formatDuration(Date.now() - startTime)}`);

        return { ...mealPlan, shoppingLists: shoppingListsResult.shoppingLists } as MealPlanOutputDto;
    }

    async generateMealPlanCyclic(input: MealPlanInputDto): Promise<MealPlanOutputDto> {
        const startTime = Date.now();
        const totalDays = input.days || 7;
        const shoppingFrequency = input.shoppingFrequencyDays || 7;
        const numberOfCycles = Math.ceil(totalDays / shoppingFrequency);

        console.log(`🔄 Generating meal plan (cyclic approach)...`);
        console.log(`   📊 Total days: ${totalDays}, Shopping frequency: ${shoppingFrequency} days, Cycles: ${numberOfCycles}`);

        const cycleResults: MealPlanOutputDto[] = [];

        for (let cycle = 0; cycle < numberOfCycles; cycle++) {
            const dayOffset = cycle * shoppingFrequency;
            const cycleDays = Math.min(shoppingFrequency, totalDays - dayOffset);

            const { result: cycleResult } = await this.timedOperation(
                `Cycle ${cycle + 1}/${numberOfCycles}: Generating days ${dayOffset + 1}-${dayOffset + cycleDays}`,
                async () => {
                    const cycleInput: MealPlanInputDto = {
                        ...input,
                        days: cycleDays,
                        shoppingFrequencyDays: cycleDays,
                    };
                    return this.generateMealPlanMultistep(cycleInput);
                },
                '  🔁 '
            );

            cycleResults.push(cycle > 0 ? this.adjustDayNumbers(cycleResult, dayOffset) : cycleResult);
        }

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

        console.log(`✅ Cyclic meal plan generation completed in ${this.formatDuration(Date.now() - startTime)}`);

        return mergedResult;
    }
}
