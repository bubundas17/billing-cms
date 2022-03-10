import {
  IsString,
  Matches,
  IsBoolean,
  IsArray,
  IsMongoId,
  IsOptional,
} from 'class-validator';

class ProductGroupDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug is not correct' })
  slug: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsMongoId()
  parent: string;

  @IsArray()
  @IsOptional()
  @IsMongoId()
  children: string[];

  @IsBoolean()
  @IsOptional()
  hidden?: boolean;
}
//TODO: Add addedby and lastEditedBy later

export default ProductGroupDto;
