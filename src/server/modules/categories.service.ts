import { DataSource, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { Category, ICategoryTreeItem } from '../entity/Category';
import { User } from '../entity/User';

const defaultCategoriesOrder: FindOptionsOrder<Category> = {
  order: 'ASC',
  name: 'ASC',
};

export class CategoriesService {
  constructor(ds: DataSource) {
    this.ds = ds;
  }

  private ds: DataSource;

  public async getAll(userId: User['id'], showHidden: boolean, typeId: Category['type']['id']): Promise<Category[]> {
    const whereClause: FindOptionsWhere<Category> = {
      type: typeId ? { id: typeId } : undefined,
      user: { id: userId },
    };

    if (!showHidden) {
      whereClause.isActive = true;
    }

    const categories = await this.ds.manager.find(Category, {
      relations: ['type', 'childrenCategories', 'parentCategory'],
      where: whereClause,
      order: defaultCategoriesOrder,
    });

    return categories;
  }

  public async getTree(userId: User['id'], showHidden: boolean, typeId: Category['type']['id']): Promise<ICategoryTreeItem[]> {
    const whereClause: FindOptionsWhere<Category> = {
      type: typeId ? { id: typeId } : undefined,
      user: { id: userId },
    };

    if (!showHidden) {
      whereClause.isActive = true;
    }

    const categories = await this.ds.manager.find(Category, {
      relations: ['type', 'parentCategory'],
      where: whereClause,
      order: defaultCategoriesOrder,
    });

    const tree = categories
      ?.filter((item) => !item.parentCategory)
      .map((itemWithoutParents) => this.getTreeItem(itemWithoutParents, categories));

    return tree;
  }

  private getTreeItem = (category: Category, categories: Category[]) => {
    const item: ICategoryTreeItem = {
      title: category.name,
      key: category.id,
      id: category.id,
      value: category.id,
      isActive: category.isActive,
      transactions: category.transactions,
    };
    const children = categories.filter((item) => item.parentCategory?.id === category?.id);
    if (children?.length) {
      item.children = children.map((child) => this.getTreeItem(child, categories));
    }

    return item;
  };
}
