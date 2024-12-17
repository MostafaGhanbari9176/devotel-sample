import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile, ParseIntPipe, NotFoundException
} from "@nestjs/common";
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MessageResponseDTO } from "../dto/response.dto";
import { PostDetailResponseDTO, PostListResponseDTO } from "./dto/post-entity.dto";

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
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

  @Get("list/page/:pagenumber/:limit")
  async pagedList(@Param('pagenumber', ParseIntPipe) page: number, @Param('limit', ParseIntPipe) limit: number):Promise<PostListResponseDTO> {
    const { posts, pageCount } = await this.postService.pagedList(page, limit);
    
    return {
      statusCode:200,
      posts:posts,
      page:page,
      pageCount:pageCount
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<PostDetailResponseDTO> {
    const post = await this.postService.findOne(id);

    if(!post) throw new NotFoundException("post not found")

    return {
      statusCode:200,
      post:post
    }
  }

  @Patch(':id')
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
  async remove(
    @Param('id') id: string,
  ): Promise<MessageResponseDTO> {
    const success = await this.postService.remove(id);

    if (!success) throw new NotFoundException('post not found');

    return {
      statusCode: 200,
      message: 'remove success',
    };
  }
}
