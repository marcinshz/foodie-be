import {Module} from '@nestjs/common';
import {RecipeController} from './recipe.controller';
import {RecipeService} from './recipe.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Recipe} from "./recipe.entity";
import {UserModule} from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Recipe]), UserModule],
    controllers: [RecipeController],
    providers: [RecipeService],
    exports: [RecipeService]
})
export class RecipeModule {
}
