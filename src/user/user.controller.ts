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

@Controller('user')
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
      statusCode: 200,
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

  @Get('list/page/:pagenumber/:limit')
  //TODO Admin access
  async pagedList(
    @Param('pagenumber', ParseIntPipe) limit: number,
    @Param('limit', ParseIntPipe) page: number,
  ): Promise<UserListResponseDTO> {
    const { users, pageCount } = await this.userService.pagedList(page, limit);

    return {
      page: page,
      users: users,
      pageCount: pageCount,
      statusCode: 200,
    };
  }

  @Get(':username')
  //TODO Admin access
  async findOne(
    @Param('username') username: string,
  ): Promise<UserDetailResponseDTO> {
    const user = await this.userService.findOne(username);

    if (!user) throw new NotFoundException('user not found');

    return {
      user: user,
      statusCode: 200,
    };
  }

  @Patch(':username')
  //TODO Admin access
  async update(
    @Param('username') username: string,
    @Body() data: UpdateUserDto,
  ): Promise<MessageResponseDTO> {
    const success = this.userService.update(username, data);
    if (!success) throw new NotFoundException('user not found');

    return {
      statusCode: 200,
      message: 'update success',
    };
  }

  @Delete(':username')
  //TODO Admin access
  async remove(
    @Param('username') username: string,
  ): Promise<MessageResponseDTO> {
    const success = await this.userService.remove(username);

    if (!success) throw new NotFoundException('user not found');

    return {
      statusCode: 200,
      message: 'remove success',
    };
  }
}
