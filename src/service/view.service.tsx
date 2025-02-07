export enum View {
  Updater,
  Authorization,
  Launcher
}

export class ViewService {
  static setView(view: View) {
    switch (view) {
      case View.Updater:
        return document.location = "/";
      case View.Authorization:
        return document.location = "/authorization";
      case View.Launcher:
        return document.location = "/launcher";
    }
  }
}