import { IsString, IsUrl, Min, IsInt } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  news_text: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsInt()
  @Min(1)
  author_id: number;
}
