import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  UserDetailResponseDTO,
  UserListResponseDTO,
} from '../user/dto/user-entity.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { MessageResponseDTO } from '../dto/response.dto';
import { CheckRole } from '../decorator/role.decorator';
import { UserRole } from '../user/entities/user.entity';

@CheckRole([UserRole.Admin])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('user/list/page/:pagenumber/:limit')
  async pagedList(
    @Param('pagenumber', ParseIntPipe) limit: number,
    @Param('limit', ParseIntPipe) page: number,
  ): Promise<UserListResponseDTO> {
    const { users, pageCount } = await this.adminService.pagedList(page, limit);

    return {
      page: page,
      users: users,
      pageCount: pageCount,
      statusCode: 200,
    };
  }

  @Get('user/:username')
  async findOne(
    @Param('username') username: string,
  ): Promise<UserDetailResponseDTO> {
    const user = await this.adminService.findOne(username);

    if (!user) throw new NotFoundException('user not found');

    return {
      user: user,
      statusCode: 200,
    };
  }

  @Patch('user/:username')
  async update(
    @Param('username') username: string,
    @Body() data: UpdateUserDto,
  ): Promise<MessageResponseDTO> {
    const success = this.adminService.update(username, data);
    if (!success) throw new NotFoundException('user not found');

    return {
      statusCode: 200,
      message: 'update success',
    };
  }

  @Delete('user/:username')
  async remove(
    @Param('username') username: string,
  ): Promise<MessageResponseDTO> {
    const success = await this.adminService.remove(username);

    if (!success) throw new NotFoundException('user not found');

    return {
      statusCode: 200,
      message: 'remove success',
    };
  }
}



