import { EntityResponseDTO, ListResponseDTO } from '../../dto/response.dto';
import { OmitType } from '@nestjs/mapped-types';
import { ApiResponseProperty } from "@nestjs/swagger";

export class PostDetailDto {
  @ApiResponseProperty({type:String})
  id: string;
  @ApiResponseProperty({type:String})
  title: string;
  @ApiResponseProperty({type:String})
  content: string;
  @ApiResponseProperty({type:String})
  imagePath: string;
}

export class PostDto extends OmitType(PostDetailDto, ['content'] as const) {}

export class PostDetailResponseDTO extends EntityResponseDTO {
  @ApiResponseProperty({type:PostDetailDto})
  post: PostDetailDto;
}

export class PostListResponseDTO extends ListResponseDTO {
  @ApiResponseProperty({type:[PostDto]})
  posts: PostDto[];
}
