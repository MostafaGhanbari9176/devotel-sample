import { IsString, Length } from "class-validator";

export class CreatePostDto {
  @IsString()
  @Length(3,undefined, {message:"lenght of title should be at least 3 characters"})
  title: string;

  @IsString()
  @Length(3,undefined, {message:"lenght of content should be at least 3 characters"})
  content: string;
}

