import { Type } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsArray,
  IsNumber,
  IsMongoId,
  IsOptional,
  IsNotEmpty,
  ArrayMinSize,
  IsPositive,
} from 'class-validator';

class PriceDto {
  @IsNumber()
  @IsPositive({ message: 'Duration must be positive' })
  duration: number;

  @IsNumber()
  @IsPositive({ message: 'Price must be positive' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'Label is required' })
  label: string;
}

class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsOptional()
  hidden?: boolean;

  @IsArray()
  // @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsNotEmpty()
  @Type(() => PriceDto)
  prices: PriceDto[];

  @IsMongoId()
  @IsNotEmpty()
  group: string;
}

export default ProductDto;
