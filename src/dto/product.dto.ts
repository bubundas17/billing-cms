import { Type } from 'class-transformer';
import {
  IsString,
  Matches,
  IsBoolean,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';

class Price {
  @IsNumber()
  duration: number;
  @IsNumber()
  price: number;
  @IsString()
  label: string;
}

class ProductDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug is not correct' })
  slug: string;

  @IsString()
  description: string;

  @IsBoolean()
  hidden: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Price)
  prices: Price[];
}

export default ProductDto;
