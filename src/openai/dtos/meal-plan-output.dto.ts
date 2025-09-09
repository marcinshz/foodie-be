export type MealPlanOutputDto = {
    title: string;
    description: string;
    days: number;
    mealsPerDay: number;
    servings: number;
    dailyTargets?: {
        calories?: number;
        protein?: number;
        fat?: number;
        carbs?: number;
    };
    plan: Array<{
        day: number;
        estimatedTime: number;
        totals: {
            calories: number;
            protein: number;
            fat: number;
            carbs: number;
        };
        meals: Array<{
            type: string;
            dish: {
                title: string;
                cuisine: string;
                description: string;
                ingredients: Array<string>;
                instructions: Array<string>;
                estimatedTime: number;
                servings: number;
                calories: number;
                macros: {
                    protein: number;
                    fat: number;
                    carbs: number;
                };
                difficulty: string;
            };
        }>;
    }>;
}
