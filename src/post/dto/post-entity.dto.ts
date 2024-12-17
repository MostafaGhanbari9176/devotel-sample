import { EntityResponseDTO, ListResponseDTO } from '../../dto/response.dto';
import { OmitType } from '@nestjs/mapped-types';

export class PostDetailDto {
  id: string;
  title: string;
  content: string;
  imagePath: string;
}

export class PostDto extends OmitType(PostDetailDto, ['content'] as const) {}

export class PostDetailResponseDTO extends EntityResponseDTO {
  post: PostDetailDto;
}

export class PostListResponseDTO extends ListResponseDTO {
  posts: PostDto[];
}
