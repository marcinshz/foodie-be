import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {RecipeService} from "./recipe.service";
import {SaveRecipeDto} from "./dtos/save-recipe.dto";

@Controller('recipe')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {
    }

    @Post()
    saveRecipe(@Body() saveRecipeDto: SaveRecipeDto) {
        return this.recipeService.saveRecipe(saveRecipeDto);
    }

    @Get('/:userId')
    getUserRecipes(@Param('userId') userId: string) {
        return this.recipeService.getUserRecipes(userId);
    }

}
