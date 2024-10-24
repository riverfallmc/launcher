type SettingsAcceptType = string | number | boolean;

export class SettingsController {
  private static storage: Map<string, SettingsAcceptType> = new Map();

  public static register(
    name: string,
    defaultValue: SettingsAcceptType
  ) {
    this.storage.set(name, defaultValue);
  };

  /** Храним в виде массива с размером в 1 элемент.
   * Это нужно чтобы JSON.parse сам парсил в нужный тип
   * Костыль? Может быть. Зато это самый адекватный по size/length способ это делать. */
  public static set<T extends SettingsAcceptType>(
    name: string,
    value: T
  ) {
    localStorage.setItem(name, JSON.stringify([value]));
  };

  public static get<T extends SettingsAcceptType>(
    name: string
  ): T {
    let value = localStorage.getItem(name);

    if (value)
      return (JSON.parse(value) as Array<T>).at(0) as T;

    return this.storage.get(name) as T;
  };
}