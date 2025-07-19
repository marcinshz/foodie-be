import {SingleDishInputDto} from "./dtos/single-dish-input.dto";

// todo add option for MealPlanInput
export const defaultConfig = (input: SingleDishInputDto, instructions: string) => {
    return {
        model: "gpt-4.1",
        input: JSON.stringify(input),
        instructions,
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