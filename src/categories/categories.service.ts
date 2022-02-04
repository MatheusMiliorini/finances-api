import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { db } from '../config/firebase';

@Injectable()
export class CategoriesService {

  private COLLECTION = 'categories';

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const doc = await db.collection(this.COLLECTION).add(createCategoryDto);
    const data = (await doc.get()).data() as CreateCategoryDto;
    return { ...data, id: doc.id };
  }

  async findAll(): Promise<Category[]> {
    const categories: Category[] = [];
    (await db.collection(this.COLLECTION).get())
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
    const doc = await db.collection(this.COLLECTION).doc(id).get();
    if (doc.exists) {
      return {
        ...doc.data() as CreateCategoryDto,
        id: doc.id
      }
    }
    return null;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category | boolean> {
    const doc = await db.collection(this.COLLECTION).doc(id).get();
    if (doc.exists) {
      await doc.ref.update(updateCategoryDto);
      return {
        ...(await doc.ref.get()).data() as CreateCategoryDto,
        id: doc.id
      }
    }
    return false;
  }

  async remove(id: string): Promise<boolean> {
    const doc = await db.collection(this.COLLECTION).doc(id).get();
    if (doc.exists) {
      await doc.ref.delete();
      return true;
    }
    return false;
  }
}
