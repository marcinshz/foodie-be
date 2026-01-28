import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserService} from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import UserAuthenticatedDto from './dtos/user-authenticated.dto';
import {User} from "../user/user.entity";
import {UserCredentialsDto} from "../user/dtos/user-credentials-dto";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {
    }

    async signIn(credentials: UserCredentialsDto): Promise<UserAuthenticatedDto> {
        const user = await this.userService.findUser(credentials.username);

        if (!await bcrypt.compare(credentials.password, user.password)) throw new UnauthorizedException();

        const payload = {username: user.username, sub: user.id};

        return {
            access_token: await this.jwtService.signAsync(payload),
            user
        }
    }

    async verifyToken(token: string): Promise<User> {
        const payload = this.jwtService.verify(token);
        if (!payload) throw new UnauthorizedException();
        return await this.userService.findUser(payload.username);
    }
}