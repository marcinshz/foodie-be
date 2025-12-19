import {Controller, Get, Param, Post, Delete, Body} from '@nestjs/common';
import {ShoppingListService} from "./shopping-list.service";

@Controller('shopping-list')
export class ShoppingListController {
    constructor(private shoppingListService: ShoppingListService) {
    }

    @Get('by-user/:userId/pinned')
    async getPinnedUserShoppingLists(@Param('userId') userId: string) {
        return await this.shoppingListService.getPinnedShoppingListsByUser(userId);
    }

    @Post(':id/pin')
    async pinShoppingList(@Param('id') id: string) {
        await this.shoppingListService.pinShoppingList(id);
        return { message: 'Shopping list pinned successfully' };
    }

    @Post(':id/unpin')
    async unpinShoppingList(@Param('id') id: string) {
        await this.shoppingListService.unpinShoppingList(id);
        return { message: 'Shopping list unpinned successfully' };
    }

    @Post(':id/item/:itemIndex/check')
    async updateItemCheckedStatus(
        @Param('id') id: string,
        @Param('itemIndex') itemIndex: string,
        @Body() body: { checked: boolean }
    ) {
        await this.shoppingListService.updateItemCheckedStatus(id, parseInt(itemIndex), body.checked);
        return { message: 'Item status updated successfully' };
    }

    @Delete(':id')
    async deleteShoppingList(@Param('id') id: string) {
        await this.shoppingListService.deleteShoppingList(id);
        return { message: 'Shopping list deleted successfully' };
    }
}

