import {Body, Controller, Post} from '@nestjs/common';
import {OpenaiService} from "./openai.service";
import {SingleDishInputDto} from "./dtos/single-dish-input.dto";
import {SingleDishOutputDto} from "./dtos/single-dish-output.dto";

@Controller('openai')
export class OpenaiController {
    constructor(private openaiService: OpenaiService) {
    }

    @Post('single-dish-default')
    async getSingleDishDefault(@Body() singleDishInput: SingleDishInputDto): Promise<SingleDishOutputDto> {
        return await this.openaiService.generateSingleDishDefault(singleDishInput);
    }

    @Post('single-dish-image')
    async getSingleDishImage(@Body() singleDishInput: SingleDishOutputDto): Promise<string> {
        return this.openaiService.generateDishImage(singleDishInput);
    }
}
