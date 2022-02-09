import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCategoryDto {

  @ApiProperty()
  name: string;

  @ApiProperty()
  active: boolean;

  @ApiPropertyOptional({
    description: 'Only provide if this category is a sub-category'
  })
  parent?: string;
}
