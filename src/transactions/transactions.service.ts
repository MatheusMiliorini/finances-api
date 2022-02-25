import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DocumentData, DocumentSnapshot } from 'firebase-admin/firestore';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { db } from 'src/config/firebase';
import Service from 'src/Service';
import { threadId } from 'worker_threads';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService extends Service {

  constructor(
    @Inject(forwardRef(() => AccountsService)) private accountsService: AccountsService,
    private categoryService: CategoriesService
  ) {
    super();
  }

  getCollection(): string {
    return 'transactions';
  }

  protected mapToModel(doc: DocumentSnapshot<DocumentData>): Transaction {
    const transactionData: CreateTransactionDto = doc.data() as CreateTransactionDto;
    return {
      ...transactionData,
      id: doc.id,
    };
  }

  async create(createAccountDto: CreateTransactionDto): Promise<Transaction> {
    const account = await this.accountsService.findOne(createAccountDto.account);
    const category = await this.categoryService.findOne(createAccountDto.category);
    let accountTo;
    if (createAccountDto.accountTo) {
      accountTo = await this.accountsService.findOne(createAccountDto.accountTo);
      if (!accountTo) {
        throw new NotFoundException("Conta destino não encontrada");
      }
    }

    if (!account) {
      throw new NotFoundException("Conta não encontrada!");
    } else if (!category) {
      throw new NotFoundException("Categoria não encontrada!");
    }

    const doc = await db.collection(this.getCollection()).add(createAccountDto);
    return this.mapToModel(await doc.get());
  }

  async findAll(accountId: string): Promise<Transaction[]> {
    const account = await this.accountsService.exists(accountId);
    if (!account) {
      throw new NotFoundException("Conta não encontrada!");
    }
    const transactions: Transaction[] = [];
    const _docs = await db.collection(this.getCollection()).where('account', '==', accountId).get();
    await Promise.all(_docs.docs.map(async transaction => {
      transactions.push(this.mapToModel(transaction));
    }));
    return transactions;
  }

  async findOne(id: string): Promise<Transaction> {
    if (!id) {
      return null;
    }
    const doc = await this.getOne(id);
    if (doc.exists) {
      return this.mapToModel(doc);
    }
    return null;
  }

  async update(id: string, updateAccountDto: UpdateTransactionDto): Promise<boolean | Transaction> {
    const account = await this.accountsService.findOne(updateAccountDto.account);
    const category = await this.categoryService.findOne(updateAccountDto.category);
    let accountTo;
    if (updateAccountDto.accountTo) {
      accountTo = await this.accountsService.findOne(updateAccountDto.accountTo);
      if (!accountTo) {
        throw new NotFoundException("Conta destino não encontrada");
      }
    }

    if (!account) {
      throw new NotFoundException("Conta não encontrada!");
    } else if (!category) {
      throw new NotFoundException("Categoria não encontrada!");
    }

    const doc = await this.getOne(id);
    if (doc.exists) {
      await doc.ref.update(updateAccountDto);
      return this.mapToModel(await doc.ref.get());
    }
    return false;
  }

}
