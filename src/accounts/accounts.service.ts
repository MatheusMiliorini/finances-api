import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { db } from 'src/config/firebase';
import { BalanceFetcher } from 'src/providers/BalanceFetcher';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {

  constructor(
    private balanceFetcher: BalanceFetcher
  ) { }

  getCollection(): string {
    return 'accounts';
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
    const docs = await db.collection(this.getCollection()).orderBy('name').get();
    const accounts: Account[] = [];
    await Promise.all(docs.docs.map(async _account => {
      const account: CreateAccountDto = _account.data() as CreateAccountDto;
      accounts.push({
        ...account,
        id: _account.id,
        balance: await this.balanceFetcher.fetchBalance(_account.id, account.initialBalance),
      })
    }));
    return accounts;
  }

  async findOne(id: string): Promise<Account | null> {
    if (!id) {
      return null;
    }
    const doc = await db.collection(this.getCollection()).doc(id).get();
    if (doc.exists) {
      const data = doc.data() as CreateAccountDto;
      return {
        ...data,
        id: doc.id,
        balance: await this.balanceFetcher.fetchBalance(doc.id, data.initialBalance),
      }
    }
    return null;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account | boolean> {
    const doc = await db.collection(this.getCollection()).doc(id).get();
    if (doc.exists) {
      await doc.ref.update(updateAccountDto);
      const data = (await doc.ref.get()).data() as CreateAccountDto;
      return {
        ...data,
        id: doc.id,
        balance: await this.balanceFetcher.fetchBalance(doc.id, data.initialBalance),
      }
    }
    return false;
  }

  async remove(id: string): Promise<boolean> {
    const doc = await db.collection(this.getCollection()).doc(id).get();
    if (doc.exists) {
      await doc.ref.update({ active: false });
      return true;
    }
    return false;
  }
}
