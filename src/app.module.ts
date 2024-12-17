import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from "@nestjs/config";
import configs from "./config/configs";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configs] }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
