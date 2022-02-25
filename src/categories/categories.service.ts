import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { db } from '../config/firebase';
import Service from 'src/Service';
import { DocumentData, DocumentSnapshot } from 'firebase-admin/firestore';

@Injectable()
export class CategoriesService extends Service {

  getCollection(): string {
    return 'categories';
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const doc = await db.collection(this.getCollection()).add(createCategoryDto);
    return this.mapToModel(await doc.get());
  }

  protected mapToModel(doc: DocumentSnapshot<DocumentData>): Category {
    const data = doc.data() as CreateCategoryDto;
    return {
      ...data,
      id: doc.id
    };
  }

  async findAll(): Promise<Category[]> {
    const categories: Category[] = [];
    (await this.getAllActive<Category>('name'))
      .forEach(doc => {
        categories.push(this.mapToModel(doc));
      });
    return categories;
  }

  async findOne(id: string): Promise<Category | null> {
    if (!id) {
      return null;
    }
    const doc = await this.getOne(id);
    if (doc.exists) {
      return this.mapToModel(doc);
    }
    return null;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category | boolean> {
    const doc = await this.getOne(id);
    if (doc.exists) {
      await doc.ref.update(updateCategoryDto);
      return this.mapToModel(await doc.ref.get());
    }
    return false;
  }

}
