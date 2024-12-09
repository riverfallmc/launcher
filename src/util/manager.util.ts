export class BaseManager {
  protected name: string;
  private static instances: Map<string, BaseManager> = new Map();

  constructor(name: string) {
    if (BaseManager.instances.has(name))
      throw new Error(`A ${name} should only have one instance of it`);

    this.name = name;
    BaseManager.instances.set(name, this);
  }

  // <T extends typeof BaseManager>
  public static register(
    managers: typeof BaseManager[]
  ) {
    managers.forEach((ManagerClass) => new ManagerClass(ManagerClass.name));
  }
}