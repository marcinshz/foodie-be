import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {AuthService} from './auth.service';
import UserAuthenticatedDto from './dtos/user-authenticated.dto';
import {User} from "../user/user.entity";
import {UserCredentialsDto} from "../user/dtos/user-credentials-dto";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('sign-in')
    async signIn(@Body() credentials: UserCredentialsDto): Promise<UserAuthenticatedDto> {
        return await this.authService.signIn(credentials);
    }

    @Get('verify-token/:token')
    async verifyToken(@Param('token') token: string): Promise<User> {
        return await this.authService.verifyToken(token);
    }
}