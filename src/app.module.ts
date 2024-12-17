import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { FirebaseModule } from './firebase/firebase.module';
import configs from './config/configs';
import { AuthenticationGuard } from './guard/authentication.guarf';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configs] }),
    DatabaseModule,
    UserModule,
    PostModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule {}
