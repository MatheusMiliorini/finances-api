import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { BalanceFetcher } from 'src/providers/BalanceFetcher';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CategoriesService } from 'src/categories/categories.service';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, BalanceFetcher, TransactionsService, CategoriesService]
})
export class AccountsModule {}
