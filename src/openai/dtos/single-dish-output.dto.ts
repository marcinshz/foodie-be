export type SingleDishOutputDto = {
    title: string;
    cuisine:string;
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
    },
    difficulty: string;
}
