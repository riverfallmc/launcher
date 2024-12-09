#![allow(unused)] // xd

/// Структура папки
/// .serenitymc/                КАТАЛОГ
///   /clients                  КАТАЛОГ
///     /magic-rpg              КАТАЛОГ
///       /client.json          ФАЙЛ
///

use std::{env, fs, path::Path};

use super::pathbuf::PathBufToString;

/// Структура для получения путей до папок\
/// Перед тем как вернет вам нужную папку - проверит существует ли она, и создаст полный путь если её нет\
/// Примеры использования:
/// ```rs
/// // эт на винде
/// let home = LauncherPaths::get_home()?; // C:\Users\testuser\AppData\Roaming
/// let launcher = LauncherPaths::get_launcher()? // C:\Users\testuser\AppData\Roaming\.serenitymc
/// ```
pub(crate) struct LauncherPaths {}

impl LauncherPaths {
  /// Внутреняя функция, которая проверяет есть ли папка, и если нет то создает её
  fn prepare_dir(folder: String) -> anyhow::Result<String> {
    fs::create_dir_all(folder.clone())?;
    Ok(folder)
  }

  /// Возвращает путь до домашней папки пользователя (в которой будет хранится)
  pub(crate) fn get_home() -> anyhow::Result<String> {
    match env::consts::OS {
      // appdata (roaming) как-бы вапщет это не домашняя папка и т.п но в майнкрафте принято уже туда все грузить крч
      "windows" => Ok(env::var("APPDATA")?),
      "linux" | "macos" => Ok(env::var("HOME")?),
      _ => Err(anyhow::anyhow!("Launcher is not compatible with your OS"))
    }
  }

  /// Возвращает полный путь до папки лаунчера
  pub(crate) fn get_launcher() -> anyhow::Result<String> {
    let home = LauncherPaths::get_home()?;
    let dir = Path::new(&home)
      .join(".serenitymc")
      .to_string()?;

    LauncherPaths::prepare_dir(dir)
  }

  /// Возвращает полный путь до папки с клиентами
  pub(crate) fn get_client_dir() -> anyhow::Result<String> {
    let launcher = LauncherPaths::get_launcher()?;
    let dir = Path::new(&launcher)
      .join("clients")
      .to_string()?;

    LauncherPaths::prepare_dir(dir)
  }

  /// Возвращает полный путь до папки указанного клиента
  pub(crate) fn get_client_path(client: String) -> anyhow::Result<String> {
    let client_dir = LauncherPaths::get_client_dir()?;
    let dir = Path::new(&client_dir)
      .join(client)
      .to_string()?;

    LauncherPaths::prepare_dir(dir)
  }
}