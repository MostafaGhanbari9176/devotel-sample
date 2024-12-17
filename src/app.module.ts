import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { FirebaseModule } from './firebase/firebase.module';
import configs from './config/configs';
import { AdminModule } from './admin/admin.module';
import { AuthenticationGuard } from './guard/authentication.guarf';
import { AuthorizationGuard } from "./guard/authorizationGuard";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configs] }),
    DatabaseModule,
    UserModule,
    PostModule,
    FirebaseModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthenticationGuard,
    },
    {
      provide:"APP_GUARD",
      useClass:AuthorizationGuard
    }
  ],
})
export class AppModule {}
