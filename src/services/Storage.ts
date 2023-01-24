class StorageService {
  private static instance: StorageService;

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }

    return StorageService.instance;
  }

  public getItem = (key: string) => {
    if (typeof localStorage === 'undefined') return undefined;
    if (localStorage.getItem(key) === '') return undefined;
    return JSON.parse(localStorage.getItem(key) as string);
  };

  public removeItem: (key: string) => void = (key: string) => {
    localStorage?.removeItem(key);
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  public setItem = (key: string, value: string | Object) => {
    localStorage?.setItem(key, JSON.stringify(value));
  };
}

export const getStorage = () => StorageService.getInstance();
