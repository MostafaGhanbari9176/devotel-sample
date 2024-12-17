import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './entities/post.entity';
import { Model } from 'sequelize-typescript';
import { join, dirname } from 'path';
import { writeFile } from 'fs/promises';
import { PostDetailDto, PostDto } from './dto/post-entity.dto';
import { UpdateUserDto } from "../user/dto/update-user.dto";

@Injectable()
export class PostService {
  constructor(@InjectModel(Post) private readonly postModel: typeof Post) {}

  async createPost(data: CreatePostDto): Promise<Post> {
    const post = await this.postModel.create({ ...data });

    return post;
  }

  async storeImage(post: Post, image: Express.Multer.File): Promise<string> {
    const path = join(
      dirname(require.main.filename),
      'assets',
      'images',
      'posts',
      image.filename.split('.').reverse()[0],
    );
    await writeFile(path, image.buffer);

    return path;
  }

  async updatePostImagePath(post: Post, path: string) {
    await post.update({ imagePath: path });
  }

  async pagedList(
    page: number,
    limit: number,
  ): Promise<{ posts: PostDto[]; pageCount: number }> {
    const offset = (page - 1) * limit;
    const result = await this.postModel.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'imagePath'],
    });

    return {
      posts: result.rows,
      pageCount: result.count,
    };
  }

  async findOne(id: string): Promise<PostDetailDto | undefined> {
    const post = await this.postModel.findByPk(id);
    return post;
  }

  async update(id: string, data: UpdatePostDto): Promise<boolean> {
    const post = await this.postModel.findByPk(id);

    if (!post) return false;

    await post.update({ ...data });

    return true;
  }

  async remove(id: string): Promise<boolean> {
    const post = await this.postModel.findByPk(id);

    if (!post) return false;

    await post.destroy({ force: true });

    return true;
  }
}
