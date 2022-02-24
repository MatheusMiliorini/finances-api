import TransactionType from "src/enums/TransactionType";
import Model from "src/Model";

export class Transaction extends Model {

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
