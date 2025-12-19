import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ShoppingList} from "./shopping-list.entity";
import {UserService} from "../user/user.service";
import {MealPlan} from "../meal-plan/meal-plan.entity";

@Injectable()
export class ShoppingListService {
    constructor(
        @InjectRepository(ShoppingList)
        private shoppingListRepository: Repository<ShoppingList>,
        private readonly userService: UserService
    ) {
    }

    async createShoppingListsForMealPlan(
        shoppingListsData: Array<{
            shoppingDay: number;
            validForDays: number[];
            items: any[];
        }>,
        mealPlan: MealPlan,
        userId: string
    ): Promise<ShoppingList[]> {
        const user = await this.userService.findUserById(userId);
        if (!user) throw new Error('User not found');

        const shoppingLists = shoppingListsData.map(listData => {
            const shoppingList = this.shoppingListRepository.create({
                shoppingDay: listData.shoppingDay,
                validForDays: listData.validForDays,
                items: listData.items,
                isPinned: false,
                mealPlan,
                user
            });
            return shoppingList;
        });

        return await this.shoppingListRepository.save(shoppingLists);
    }

    async getShoppingListsByMealPlan(mealPlanId: string): Promise<any[]> {
        const shoppingLists = await this.shoppingListRepository.find({
            where: {
                mealPlan: {
                    id: mealPlanId
                }
            }
        });

        return shoppingLists.map(list => {
            // Ensure each item has a checked property
            const itemsWithChecked = list.items.map(item => ({
                ...item,
                checked: item.checked !== undefined ? item.checked : false
            }));
            
            return {
                id: list.id,
                shoppingDay: list.shoppingDay,
                validForDays: list.validForDays,
                items: itemsWithChecked,
                isPinned: list.isPinned
            };
        });
    }

    async getPinnedShoppingListsByUser(userId: string): Promise<any[]> {
        const shoppingLists = await this.shoppingListRepository.find({
            where: {
                user: {
                    id: userId
                },
                isPinned: true
            },
            relations: ['mealPlan']
        });

        return shoppingLists.map(list => {
            // Ensure each item has a checked property
            const itemsWithChecked = list.items.map(item => ({
                ...item,
                checked: item.checked !== undefined ? item.checked : false
            }));
            
            return {
                id: list.id,
                shoppingDay: list.shoppingDay,
                validForDays: list.validForDays,
                items: itemsWithChecked,
                isPinned: list.isPinned,
                mealPlanTitle: list.mealPlan?.title || 'Unknown Meal Plan'
            };
        });
    }

    async pinShoppingList(id: string): Promise<void> {
        const shoppingList = await this.shoppingListRepository.findOneBy({id});
        if (!shoppingList) throw new Error('Shopping list not found');
        
        shoppingList.isPinned = true;
        await this.shoppingListRepository.save(shoppingList);
    }

    async unpinShoppingList(id: string): Promise<void> {
        const shoppingList = await this.shoppingListRepository.findOneBy({id});
        if (!shoppingList) throw new Error('Shopping list not found');
        
        shoppingList.isPinned = false;
        await this.shoppingListRepository.save(shoppingList);
    }

    async deleteShoppingList(id: string): Promise<void> {
        const shoppingList = await this.shoppingListRepository.findOneBy({id});
        if (!shoppingList) throw new Error('Shopping list not found');
        
        await this.shoppingListRepository.remove(shoppingList);
    }

    async updateItemCheckedStatus(id: string, itemIndex: number, checked: boolean): Promise<void> {
        const shoppingList = await this.shoppingListRepository.findOneBy({id});
        if (!shoppingList) throw new Error('Shopping list not found');
        
        if (itemIndex < 0 || itemIndex >= shoppingList.items.length) {
            throw new Error('Invalid item index');
        }
        
        shoppingList.items[itemIndex].checked = checked;
        
        await this.shoppingListRepository.save(shoppingList);
    }
}

