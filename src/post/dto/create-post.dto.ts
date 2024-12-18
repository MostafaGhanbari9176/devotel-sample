import { IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
  @IsString()
  @Length(3,undefined, {message:"lenght of title should be at least 3 characters"})
  @ApiProperty({ required: true, type: String })
  title: string;

  @IsString()
  @Length(3,undefined, {message:"lenght of content should be at least 3 characters"})
  @ApiProperty({ required: true, type: String })
  content: string;
}

