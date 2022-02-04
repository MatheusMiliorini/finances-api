import { ApiProperty } from "@nestjs/swagger";

export class CreateAccountDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  initialBalance: number;

  @ApiProperty()
  active: boolean;
}
