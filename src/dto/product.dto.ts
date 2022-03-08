import { prop } from '@typegoose/typegoose';
import { IsString, Matches, IsBoolean, IsArray } from 'class-validator';

type Price = {
  duration: number;
};

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
  @prop({ type: [Price] })
  prices: Price[];
}

export default ProductDto;
