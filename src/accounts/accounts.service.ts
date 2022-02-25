import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DocumentData, DocumentSnapshot } from 'firebase-admin/firestore';
import { db } from 'src/config/firebase';
import { BalanceFetcher } from 'src/providers/BalanceFetcher';
import Service from 'src/Service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService extends Service {

  constructor(private balanceFetcher: BalanceFetcher) {
    super();
  }

  protected getCollection(): string {
    return 'accounts';
  }

  protected async mapToModel(doc: DocumentSnapshot<DocumentData>): Promise<Account> {
    const account: CreateAccountDto = doc.data() as CreateAccountDto;
    return {
      ...account,
      id: doc.id,
      balance: await this.balanceFetcher.fetchBalance(doc.id, account.initialBalance),
    };
  }

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const doc = await db.collection(this.getCollection()).add(createAccountDto);
    return {
      ...(await doc.get()).data() as CreateAccountDto,
      id: doc.id,
      balance: createAccountDto.initialBalance
    }
  }

  async findAll(): Promise<Account[]> {
    const docs = await this.getAllActive();
    const accounts: Account[] = [];
    await Promise.all(docs.docs.map(async _account => {
      accounts.push(await this.mapToModel(_account));
    }));
    return accounts.sort((a, b) => a.name > b.name ? 1 : -1);
  }

  async findOne(id: string): Promise<Account | null> {
    if (!id) {
      return null;
    }
    const doc = await this.getOne(id);
    if (doc.exists) {
      return await this.mapToModel(doc);
    }
    return null;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account | boolean> {
    const doc = await this.getOne(id);
    if (doc.exists) {
      await doc.ref.update(updateAccountDto);
      return this.mapToModel(await doc.ref.get());
    }
    return false;
  }

}
