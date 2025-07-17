import {Injectable} from '@nestjs/common';
import OpenAIApi from 'openai';
import {ConfigService} from "@nestjs/config";
import {defaultConfig} from "./model.configurations";
import {SingleDishInputDto} from "./dtos/single-dish-input.dto";
import {singleDishInstruction} from "./model.instructions";
import {SingleDishOutputDto} from "./dtos/single-dish-output.dto";

@Injectable()
export class OpenaiService {
    private openai: OpenAIApi;

    constructor(private configService: ConfigService) {
        this.openai = new OpenAIApi({
            apiKey: process.env.OPEN_AI_SECRET_KEY,
        });
    }

    async generateSingleDishDefault(input: SingleDishInputDto): Promise<SingleDishOutputDto> {
        const response = await this.openai.responses.create(defaultConfig(input, singleDishInstruction));
        return JSON.parse(response.output_text);
    }

    async generateMealPlan() {
    }
}
