import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  ParseIntPipe, Res, Req
} from "@nestjs/common";
import { UserService } from './user.service';
import { SignUpDto } from "./dto/sign-up.dto";
import { UpdateUserDto } from './dto/update-user.dto';
import { MessageResponseDTO } from '../dto/response.dto';
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import {
  UserDetailResponseDTO,
  UserListResponseDTO,
} from './dto/user-entity.dto';
import { Request, Response } from "express";
import { UnAuthorizedRoute } from "../decorator/auth.decorator";
import { Identity } from "../decorator/identity.decorator";
import { IdentityDto } from "../dto/identity.dto";
import { CheckRole } from "../decorator/role.decorator";
import { UserRole } from "./entities/user.entity";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller('user')
@CheckRole([UserRole.Admin, UserRole.Simple])
@ApiTags("User")
@ApiBearerAuth("access_token")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("signup")
  @UnAuthorizedRoute()
  async signup(@Body() data: SignUpDto, @Res({passthrough:true}) res:Response): Promise<LoginResponseDto> {
    const emailIsUsed = this.userService.emailIsExists(data.email);

    if (emailIsUsed) throw new BadRequestException('Email is already in use');

    const {expirationTime, refreshToken, token} = await this.userService.signup(data);

    res.cookie("refresh_token", refreshToken, { httpOnly: true, path:"/user/auth/refresh"});

    return {
      statusCode: 201,
      token,
      expirationTime
    };
  }

  @Post("login")
  @UnAuthorizedRoute()
  async login(@Body() data: LoginDto, @Res({passthrough:true}) res:Response): Promise<LoginResponseDto> {
    const userIsExists = this.userService.userIsExists(data.email);

    if (!userIsExists) throw new NotFoundException('not found');

    const {expirationTime, refreshToken, token} = await this.userService.login(data);

    res.cookie("refresh_token", refreshToken, { httpOnly: true, path:"/user/auth/refresh"});

    return {
      statusCode: 200,
      token,
      expirationTime
    };
  }

  // @Post("auth/refresh")
  // async refresh(@Req() req:Request, @Res({passthrough:true}) res:Response): Promise<LoginResponseDto> {
  //
  // }

  @Get('detail')
  async detail(
    @Identity() identity:IdentityDto
  ): Promise<UserDetailResponseDTO> {
    const user = await this.userService.findOne(identity.username);

    if (!user) throw new NotFoundException('user not found');

    return {
      user: user,
      statusCode: 200,
    };
  }

  @Patch('update')
  async update(
    @Identity() identity:IdentityDto,
    @Body() data: UpdateUserDto,
  ): Promise<MessageResponseDTO> {
    const success = this.userService.update(identity.username, data);
    if (!success) throw new NotFoundException('user not found');

    return {
      statusCode: 200,
      message: 'update success',
    };
  }

  @Delete('logout')
  async logout(
    @Identity() identity:IdentityDto,
  ): Promise<MessageResponseDTO> {
    const success = await this.userService.logout(identity.username, identity.token);

    if (!success) throw new NotFoundException('user not found');

    return {
      statusCode: 200,
      message: 'logout success',
    };
  }
}
