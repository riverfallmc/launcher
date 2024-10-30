export type SettingsValueType = string | number | boolean;

export interface Settings {
  name: string,
  description: string,
  id: string,
  default: SettingsValueType,
  onChange?: (value: SettingsValueType) => void;
};

export class SettingsManager {
  private static storage: Map<string, Omit<Settings, "id">> = new Map();

  public static register(
    settings: Settings
  ) {
    this.storage.set(settings.id, { ...settings });
  };

  /** Храним в виде массива с размером в 1 элемент.
   * Это нужно чтобы JSON.parse сам парсил в нужный тип
   * Костыль? Может быть. Зато это самый адекватный по size/length способ это делать. */
  public static set<T extends SettingsValueType>(
    id: string,
    value: T
  ) {
    localStorage.setItem(id, JSON.stringify([value]));

    let setting = this.storage.get(id);
    if (setting && setting.onChange)
      setting?.onChange(value);
  };

  public static getDefault(id: string): SettingsValueType | undefined {
    return this.storage.get(id)!.default;
  }

  public static get<T extends SettingsValueType>(
    id: string
  ): T {
    let value = localStorage.getItem(id);

    if (value)
      return (JSON.parse(value) as Array<T>).at(0) as T;

    // Получаем дефолтное значение
    return this.getDefault(id) as T;
  };

  public static getAll() {
    return this.storage;
  }
}