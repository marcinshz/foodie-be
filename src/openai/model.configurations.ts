import {SingleDishInputDto} from "./dtos/single-dish-input.dto";
import {MealPlanInputDto} from "./dtos/meal-plan-input.dto";

export const defaultConfig = (input: SingleDishInputDto | MealPlanInputDto, instructions: string) => {
    return {
        model: "gpt-5.1",
        input: instructions + '\n\n' + JSON.stringify(input),
    }
}

export const webSearchConfig = (input: any, instructions: string) => {
    return {
        model: "gpt-4.1",
        tools: [{type: "web_search_preview"}],
        input: JSON.stringify(input),
        instructions,
    }
}