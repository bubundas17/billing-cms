import {
  IsString,
  IsBoolean,
  IsMongoId,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

// class PriceDto {
//   @IsNumber()
//   @IsPositive({ message: 'Duration must be positive' })
//   duration: number;

//   @IsNumber()
//   @IsPositive({ message: 'Price must be positive' })
//   price: number;

//   @IsString()
//   @IsNotEmpty({ message: 'Label is required' })
//   label: string;
// }

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

  // @IsArray()
  // @ArrayMinSize(1)
  // @Type(() => PriceDto)
  // @IsNotEmpty()
  // @ValidateNested({ each: true })
  // prices: PriceDto[];

  @IsMongoId()
  @IsNotEmpty()
  group: string;
}

export default ProductDto;
