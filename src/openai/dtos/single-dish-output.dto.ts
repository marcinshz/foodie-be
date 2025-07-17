export type SingleDishOutputDto = {
    title: string;
    description: string;
    ingredients: Array<string>;
    instructions: Array<string>;
    estimatedTime: number;
    servings: number;
    totalWeight: number;
    weightPerServing: number;
    caloriesPer100g: number;
    macrosPer100g: {
        protein: number;
        fat: number;
        carbs: number;
    },
    difficulty: string;
}
