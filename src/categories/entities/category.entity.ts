import Model from "src/Model";

export class Category extends Model {
  name: string;
  parent?: string;
  active: boolean;
}
