import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserModule} from './user/user.module';
import {User} from "./user/user.entity";
import {AuthModule} from './auth/auth.module';
import { OpenaiModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { RecipeModule } from './recipe/recipe.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'admin',
            database: 'foodie-db',
            entities: [User],
            synchronize: true,
            autoLoadEntities: true
        }),
        UserModule,
        AuthModule,
        OpenaiModule,
        RecipeModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
