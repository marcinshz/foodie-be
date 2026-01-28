export type SingleDishOutputDto = {
    title: string;
    cuisine: string;
    description: string;
    ingredients: Array<string>;
    instructions: Array<string>;
    estimatedTime: number; // in minutes
    servings: number; // number of portions the recipe makes
    calories: number; // kcal per single serving
    macros: {
        protein: number; // protein grams per single serving
        fat: number; // fat grams per single serving
        carbs: number; // carbs grams per single serving
    };
    difficulty: string;
}
