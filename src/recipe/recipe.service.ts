import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Recipe} from "./recipe.entity";
import {SaveRecipeDto} from "./dtos/save-recipe.dto";
import {UserService} from "../user/user.service";

@Injectable()
export class RecipeService {
    constructor(@InjectRepository(Recipe)
                private recipeRepository: Repository<Recipe>,
                private readonly userService: UserService
    ) {
    }

    async saveRecipe(saveRecipeDto: SaveRecipeDto): Promise<Recipe> {
        const user = await this.userService.findUserById(saveRecipeDto.userId);
        if (!user) throw new Error('User not found');
        const data = {
            ...saveRecipeDto,
            ingredients: JSON.stringify(saveRecipeDto.ingredients),
            macros: JSON.stringify(saveRecipeDto.macros),
            instructions: JSON.stringify(saveRecipeDto.instructions),
            user,
        };
        const recipe = this.recipeRepository.create(data);
        return await this.recipeRepository.save(recipe);
    }

    async deleteRecipe(id: string): Promise<Recipe> {
        const recipe = await this.recipeRepository.findOneBy({id});
        if (!recipe) throw new Error('Recipe not found');
        return await this.recipeRepository.remove(recipe);
    }

    async getUserRecipes(userId: string): Promise<Recipe[]> {
        return (await this.recipeRepository.find({
            where: {
                user: {
                    id: userId
                }
            }
        })).map((recipe) => {
            recipe.ingredients = JSON.parse(recipe.ingredients);
            recipe.instructions = JSON.parse(recipe.instructions);
            recipe.macros = JSON.parse(recipe.macros);
            return recipe;
        });
    }

    async getRecipe(id: string): Promise<Recipe> {
        const recipe = await this.recipeRepository.findOneBy({id});
        console.log(recipe)
        if (!recipe) throw new Error('Recipe not found');
        recipe.ingredients = JSON.parse(recipe.ingredients);
        recipe.instructions = JSON.parse(recipe.instructions);
        recipe.macros = JSON.parse(recipe.macros);
        return recipe;
    }
}
