import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { db } from '../config/firebase';
import Service from 'src/Service';

@Injectable()
export class CategoriesService extends Service {

  getCollection(): string {
    return 'categories';
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const doc = await db.collection(this.getCollection()).add(createCategoryDto);
    const data = (await doc.get()).data() as CreateCategoryDto;
    return { ...data, id: doc.id };
  }

  async findAll(): Promise<Category[]> {
    const categories: Category[] = [];
    (await db.collection(this.getCollection()).where('active', '==', true).orderBy('name').get())
      .forEach(doc => {
        const data = doc.data() as Category;
        categories.push({
          ...data,
          id: doc.id
        })
      });
    return categories;
  }

  async findOne(id: string): Promise<Category | null> {
    if (!id) {
      return null;
    }
    const doc = await db.collection(this.getCollection()).doc(id).get();
    if (doc.exists) {
      return {
        ...doc.data() as CreateCategoryDto,
        id: doc.id
      }
    }
    return null;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category | boolean> {
    const doc = await db.collection(this.getCollection()).doc(id).get();
    if (doc.exists) {
      await doc.ref.update(updateCategoryDto);
      return {
        ...(await doc.ref.get()).data() as CreateCategoryDto,
        id: doc.id
      }
    }
    return false;
  }

}
