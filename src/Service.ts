import { db } from "./config/firebase";

export default abstract class Service {

  abstract getCollection(): string;

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