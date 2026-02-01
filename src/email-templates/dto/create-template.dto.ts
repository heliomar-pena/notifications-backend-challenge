import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
  IsIn,
} from 'class-validator';

export class TemplateVariableDto {
  @ApiProperty({
    example: 'A_VARIABLE_HERE',
    description: 'Variable key',
  })
  @IsString()
  key: string;

  @ApiProperty({
    enum: ['string', 'number'],
    example: 'string',
    description: 'Variable type',
  })
  @IsIn(['string', 'number'])
  type: 'string' | 'number';

  @ApiProperty({
    type: 'string',
    example: 'default value in case variable is not provided',
    required: false,
    description: 'Fallback value (string or number)',
  })
  @IsOptional()
  fallback_value: string | number | null;
}

export class CreateTemplateDto {
  @IsString()
  @ApiProperty({ example: 'My first template' })
  name: string;

  @IsString()
  @ApiProperty({
    example: '<div>This gives style to my email, {{{A_VARIABLE_HERE}}}</div>',
  })
  html: string;

  @ApiProperty({
    type: TemplateVariableDto,
    isArray: true,
    required: false,
    description: 'Template variables',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  variables: TemplateVariableDto[];
}
