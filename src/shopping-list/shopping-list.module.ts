import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ShoppingList} from "./shopping-list.entity";
import {ShoppingListService} from "./shopping-list.service";
import {ShoppingListController} from "./shopping-list.controller";
import {UserModule} from "../user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([ShoppingList]),
        UserModule
    ],
    controllers: [ShoppingListController],
    providers: [ShoppingListService],
    exports: [ShoppingListService]
})
export class ShoppingListModule {
}

