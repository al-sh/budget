import { v4 } from 'uuid';
import { Category } from '../server/entity/Category';
import { LocalCategory, LocalCategoryTreeItem } from '../server/types/categories';
import { ETRANSACTION_TYPE } from '../server/types/transactions';
import { getLocalDataService } from '../services/LocalDataService';
import { formatDateISOstr } from '../utils/format';

class CategoriesStore {
  private static instance: CategoriesStore;

  public static getInstance(): CategoriesStore {
    if (!CategoriesStore.instance) {
      CategoriesStore.instance = new CategoriesStore();
    }

    return CategoriesStore.instance;
  }

  private _localDataService = getLocalDataService();

  public create = (formValues: Category) =>
    new Promise<void>((resolve) => {
      const categories = this._localDataService.categories;
      categories.push({
        id: v4(),
        isActive: formValues.isActive ? formValues.isActive : true,
        mpath: '',
        name: formValues.name ? formValues.name : '',
        order: formValues.order ? formValues.order : 0,
        parentCategoryId: formValues.parentCategory?.id ? formValues.parentCategory.id : null,
        typeId: formValues.type?.id ? formValues.type?.id : ETRANSACTION_TYPE.EXPENSE,
      });
      this._localDataService.categories = categories.sort((a, b) => a.order - b.order);
      resolve();
    });

  public delete = (id: string) =>
    new Promise<void>((resolve, reject) => {
      const categories = this._localDataService.categories;
      const catToUpdateIdx = categories.findIndex((item) => item.id === id);

      if (catToUpdateIdx === -1) {
        reject('category delete, id not found:' + id);
        return;
      }

      const transactions = this._localDataService.transactions;
      const catTransactions = transactions.filter((tran) => tran.categoryId === id);

      if (catTransactions.length) {
        alert(
          'Счет сделан неактивным, а не удалён, т.к. по счету были найдены транзакции. \nДаты:\n' +
            catTransactions.map((tran) => formatDateISOstr(tran.dt)).join('\n')
        );
        categories[catToUpdateIdx].isActive = false;
      } else {
        console.log('category delete', catToUpdateIdx);
        categories.splice(catToUpdateIdx, 1);
      }

      this._localDataService.categories = categories;

      resolve();
    });

  public getOne = (id: string) => {
    const categories = this._localDataService.categories;
    return categories.find((item) => item.id === id);
  };

  public getTree = (typeId?: ETRANSACTION_TYPE, showHidden?: boolean) =>
    new Promise<LocalCategoryTreeItem[]>((resolve) => {
      const rawCategories = this._localDataService.categories;
      const categories = rawCategories.filter((cat) => {
        let show = true;
        if (typeId) {
          let transformedTypeId = typeId;
          if (typeId === ETRANSACTION_TYPE.RETURN_EXPENSE) {
            transformedTypeId = ETRANSACTION_TYPE.EXPENSE;
          }
          if (typeId === ETRANSACTION_TYPE.RETURN_INCOME) {
            transformedTypeId = ETRANSACTION_TYPE.INCOME;
          }
          if (cat.typeId !== transformedTypeId) {
            show = false;
          }
        }
        if (!showHidden && !cat.isActive) {
          show = false;
        }
        return show;
      });
      const rootCategories = categories.filter((cat) => cat.parentCategoryId === null);
      const categoriesTree: LocalCategoryTreeItem[] = rootCategories.map((rootCat) => {
        const children: LocalCategoryTreeItem[] = categories
          .filter((cat) => rootCat.id === cat.parentCategoryId)
          .map((item) => this.transformCategoryToTreeItem(item));
        return { ...this.transformCategoryToTreeItem(rootCat), children: children };
      });
      resolve(categoriesTree);
    });

  private transformCategoryToTreeItem: (cat: LocalCategory) => LocalCategoryTreeItem = (cat: LocalCategory) => {
    return { id: cat.id, key: cat.id, value: cat.id, isActive: cat.isActive, title: cat.name };
  };

  public update = (id: string, formValues: LocalCategory) =>
    new Promise<void>((resolve, reject) => {
      const categories = this._localDataService.categories;
      const categoryToUpdateIdx = categories.findIndex((item) => item.id === id);
      if (categoryToUpdateIdx === -1) {
        console.error('categoryToUpdateIdx not found', id, formValues);
        reject();
        return;
      }
      categories.splice(categoryToUpdateIdx, 1);
      categories.push({ ...formValues, id: id });
      this._localDataService.categories = categories.sort((a, b) => a.order - b.order);
      resolve();
    });
}

export const getCategoriesStore = () => CategoriesStore.getInstance();
