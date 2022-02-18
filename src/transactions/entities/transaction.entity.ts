import { Account } from "src/accounts/entities/account.entity";
import { Category } from "src/categories/entities/category.entity";
import TransactionType from "src/enums/TransactionType";

export class Transaction {

  id: string;

  name: string;

  value: number;

  type: TransactionType;

  note: string;

  date: Date;

  payDate: Date;

  account: string;

  category: string;

  accountTo?: string;
}
