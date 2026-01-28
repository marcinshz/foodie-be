import {Body, Controller, Post} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserCredentialsDto} from "./dtos/user-credentials-dto";
import {User} from "./user.entity";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {
    }

    @Post()
    async createUser(@Body() credentials: UserCredentialsDto): Promise<User> {
        return await this.userService.createUser(credentials);
    }
}
