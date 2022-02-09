import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import TransactionType from "src/enums/TransactionType";

export class CreateTransactionDto {

    @ApiProperty()
    name: string;

    @ApiProperty()
    value: number;

    @ApiProperty()
    type: TransactionType;

    @ApiProperty()
    note: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    payDate: Date;

    @ApiProperty()
    account: string;
    
    @ApiProperty()
    category: string;

    @ApiPropertyOptional()
    accountTo?: string;

}
