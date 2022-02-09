import { Injectable } from '@nestjs/common';
import { db } from 'src/config/firebase';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {

  getCollection(): string {
    return 'accounts';
  }

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const doc = await db.collection(this.getCollection()).add(createAccountDto);
    return {
      ...(await doc.get()).data() as CreateAccountDto,
      id: doc.id
    }
  }

  async findAll(): Promise<Account[]> {
    const docs = await db.collection(this.getCollection()).orderBy('name').get();
    const accounts: Account[] = [];
    docs.forEach(doc => {
      accounts.push({
        ...doc.data() as CreateAccountDto,
        id: doc.id
      });
    });
    return accounts;
  }

  async findOne(id: string): Promise<Account | null> {
    if (!id) {
      return null;
    }
    const doc = await db.collection(this.getCollection()).doc(id).get();
    if (doc.exists) {
      return {
        ...doc.data() as CreateAccountDto,
        id: doc.id
      }
    }
    return null;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account | boolean> {
    const doc = await db.collection(this.getCollection()).doc(id).get();
    if (doc.exists) {
      await doc.ref.update(updateAccountDto);
      return {
        ...(await doc.ref.get()).data() as CreateAccountDto,
        id: doc.id
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
