export type MealPlanOutputDto = {
    title: string;
    description: string;
    days: number;
    mealsPerDay: number;
    servings: number; // number of people this meal plan serves
    dailyTargets?: {
        calories?: number; // target total calories per day
        protein?: number; // target total protein grams per day
        fat?: number; // target total fat grams per day
        carbs?: number; // target total carbs grams per day
    };
    plan: Array<{
        day: number;
        estimatedTime: number; // total cooking time for the day in minutes
        totals: {
            calories: number; // sum of all meal calories for the day
            protein: number; // sum of all meal protein for the day
            fat: number; // sum of all meal fat for the day
            carbs: number; // sum of all meal carbs for the day
        };
        meals: Array<{
            type: string; // e.g., "Breakfast", "Lunch", "Dinner"
            dish: {
                title: string;
                cuisine: string;
                description: string;
                ingredients: Array<string>;
                instructions: Array<string>;
                estimatedTime: number; // cooking time in minutes
                servings: number; // number of portions this dish makes
                calories: number; // kcal per single serving
                macros: {
                    protein: number; // protein grams per single serving
                    fat: number; // fat grams per single serving
                    carbs: number; // carbs grams per single serving
                };
                difficulty: string;
            };
        }>;
    }>;
}
