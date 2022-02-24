import Model from "src/Model";

export class Account extends Model {
  name: string;
  initialBalance: number;
  active: boolean;
  balance: number;
}
