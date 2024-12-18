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
import { ErrorResponseDTO, MessageResponseDTO } from "../dto/response.dto";
import { CheckRole } from '../decorator/role.decorator';
import { UserRole } from '../user/entities/user.entity';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from "@nestjs/swagger";

@Controller('admin')
@CheckRole([UserRole.Admin])
@ApiTags("Admin")
@ApiBearerAuth("access_token")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('user/list/page/:pagenumber/:limit')
  @ApiOperation({ summary: "paged list of all users | `Admin Access`" })
  @ApiParam({ name: "pagenumber", type: Number, description: "page number" })
  @ApiParam({ name: "limit", type: Number, description: "number of users per page" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiOkResponse({ type: UserListResponseDTO })
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
  @ApiOperation({ summary: "detail of an user | `Admin Access`" })
  @ApiParam({ name: "username", type: String })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiOkResponse({ type: UserDetailResponseDTO })
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
  @ApiOperation({ summary: "updating an user | `Admin Access`" })
  @ApiParam({ name: "username", type: String })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiOkResponse({ type: MessageResponseDTO })
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
  @ApiOperation({ summary: "deleting an user | `Admin Access`" })
  @ApiParam({ name: "username", type: String })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiOkResponse({ type: MessageResponseDTO })
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



