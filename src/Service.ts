import { DocumentData, DocumentSnapshot } from "firebase-admin/firestore";
import { db } from "./config/firebase";
import Model from "./Model";

export default abstract class Service {

  protected abstract getCollection(): string;

  protected mapToModel(doc: DocumentSnapshot<DocumentData>): Model | Promise<Model> {
    throw new Error("Method not implemented");
  }

  async getAllActive<T>(orderBy?: keyof T) {
    const query = db.collection(this.getCollection()).where('active', '==', true);
    if (orderBy && typeof orderBy == 'string') {
      query.orderBy(orderBy);
    }
    return await query.get();
  }

  async getOne(id: string) {
    return await db.collection(this.getCollection()).doc(id).get();
  }

  async exists(id: string): Promise<boolean> {
    const doc = await db.collection(this.getCollection()).doc(id).get();
    return doc.exists;
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