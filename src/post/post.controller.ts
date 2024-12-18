import {
  Body,
  Controller,
  Delete,
  Get, HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ErrorResponseDTO, MessageResponseDTO } from "../dto/response.dto";
import {
  PostDetailResponseDTO,
  PostListResponseDTO,
} from './dto/post-entity.dto';
import { CheckRole } from '../decorator/role.decorator';
import { UserRole } from '../user/entities/user.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth, ApiBody, ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse,
  ApiOperation, ApiParam,
  ApiTags
} from "@nestjs/swagger";

@Controller('post')
@CheckRole([UserRole.Admin, UserRole.Simple])
@ApiTags("Post")
@ApiBearerAuth("access_token")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: "creating a new post" })
  @ApiCreatedResponse({ type: MessageResponseDTO })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async create(
    @Body() data: CreatePostDto,
    @UploadedFile('image') image: Express.Multer.File,
  ): Promise<MessageResponseDTO> {
    const post = await this.postService.createPost(data);
    const imagePath = await this.postService.storeImage(post, image);
    await this.postService.updatePostImagePath(post, imagePath);

    return {
      statusCode: 201,
      message: 'Post ',
    };
  }

  @Get('list/page/:pagenumber/:limit')
  @ApiOperation({ summary: "list of all posts, each user access just itself posts" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiParam({ name: "pagenumber", type: Number, description: "page number" })
  @ApiParam({ name: "limit", type: Number, description: "number of posts per page" })
  @ApiOkResponse({ type: PostListResponseDTO })
  async pagedList(
    @Param('pagenumber', ParseIntPipe) page: number,
    @Param('limit', ParseIntPipe) limit: number,
  ): Promise<PostListResponseDTO> {
    const { posts, pageCount } = await this.postService.pagedList(page, limit);

    return {
      statusCode: 200,
      posts: posts,
      page: page,
      pageCount: pageCount,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: "a post detail" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiParam({ name: "id", type: Number, description: "post id" })
  @ApiOkResponse({ type: PostDetailResponseDTO })
  async findOne(@Param('id') id: string): Promise<PostDetailResponseDTO> {
    const post = await this.postService.findOne(id);

    if (!post) throw new NotFoundException('post not found');

    return {
      statusCode: 200,
      post: post,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: "updating a post" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiParam({ name: "id", type: Number, description: "post id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePostDto,
  ): Promise<MessageResponseDTO> {
    const success = this.postService.update(id, data);
    if (!success) throw new NotFoundException('post not found');

    return {
      statusCode: 200,
      message: 'update success',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: "deleting a post" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  @ApiParam({ name: "id", type: Number, description: "post id" })
  @ApiOkResponse({ type: MessageResponseDTO })
  async remove(@Param('id') id: string): Promise<MessageResponseDTO> {
    const success = await this.postService.remove(id);

    if (!success) throw new NotFoundException('post not found');

    return {
      statusCode: 200,
      message: 'remove success',
    };
  }
}
