import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./entities/user.entity";
import { FirebaseModule } from "../firebase/firebase.module";

@Module({
  imports:[SequelizeModule.forFeature([User]), FirebaseModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
