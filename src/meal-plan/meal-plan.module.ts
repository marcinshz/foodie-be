import {Module} from '@nestjs/common';
import {MealPlanController} from './meal-plan.controller';
import {MealPlanService} from './meal-plan.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MealPlan} from "./meal-plan.entity";
import {UserModule} from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([MealPlan]), UserModule],
    controllers: [MealPlanController],
    providers: [MealPlanService],
    exports: [MealPlanService]
})
export class MealPlanModule {
}

