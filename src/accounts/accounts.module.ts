import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { BalanceFetcher } from 'src/providers/BalanceFetcher';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  controllers: [AccountsController],
  providers: [AccountsService, BalanceFetcher],
})
export class AccountsModule { }
