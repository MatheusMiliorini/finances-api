import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty()
  name: string;
  
  @ApiPropertyOptional({
    description: 'Only provide if this category is a sub-category'
  })
  parent?: string;
}
