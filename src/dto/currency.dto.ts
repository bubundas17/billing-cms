import {
  IsString,
  IsOptional,
  IsBoolean,
  IsPositive,
  IsNotEmpty,
  IsAlpha,
  Length,
} from 'class-validator';

class CurrencyDto {
  @IsString({ message: 'Name is not correct' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Length(3, 3, {
    message: 'Please enter three letters ISO 4217 currency code',
  })
  @IsAlpha(undefined, { message: 'Only string value required' })
  @IsNotEmpty({ message: 'Currency code is required' })
  code: string;

  @IsNotEmpty({ message: 'Symbol is required' })
  @IsString({ message: 'Symbol is not correct' })
  symbol: string;

  @IsString({ message: 'Prefix is not correct' })
  @IsOptional()
  prefix?: string;

  @IsString({ message: 'Suffix is not correct' })
  @IsOptional()
  suffix?: string;

  @IsBoolean({ message: 'Default is not correct' })
  @IsOptional()
  default?: boolean;

  @IsPositive({ message: 'Rate must be positive number' })
  @IsNotEmpty({ message: 'Rate is required' })
  rate: number;
}

export default CurrencyDto;
