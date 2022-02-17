import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AccountsService } from 'src/accounts/accounts.service';
import { CategoriesService } from 'src/categories/categories.service';
import { BalanceFetcher } from 'src/providers/BalanceFetcher';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, AccountsService, CategoriesService, BalanceFetcher]
})
export class TransactionsModule { }
