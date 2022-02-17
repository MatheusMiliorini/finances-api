import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Account } from "src/accounts/entities/account.entity";
import TransactionType from "src/enums/TransactionType";
import { TransactionsService } from "src/transactions/transactions.service";

@Injectable()
export class BalanceFetcher {

  constructor(
    private readonly transactionService: TransactionsService
  ) { }

  async fetchBalance(accountId: string, initialBalance: number): Promise<number> {
    let sum = initialBalance;
    (await this.transactionService.findAll(accountId)).forEach(transaction => {
      sum += (transaction.type == TransactionType.CREDIT ? transaction.value : -transaction.value);
    });
    return sum;
  }

}