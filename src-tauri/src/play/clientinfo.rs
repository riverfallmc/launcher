use std::{fs::File, path::{Path, PathBuf}};
use mc_version_parser::types::VersionData;
use serde::{Deserialize, Serialize};
use crate::util::paths::LauncherPaths;

/// Модуль, который парсит
/// файл ${папка клиента}/client.json

const FILE: &str = "client.json";

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct ClientInfo {
  pub version_name: String,
  pub min_java_version: u8,
}

/// Формирует пути и проверяет их на существование
impl ClientInfo {
  /// ``EXAMPLE``\
  /// /home/test_user/.serenitymc/client/test_client/versions/Fabric 1.18.2
  pub fn get_folder(
    &self,
    base_dir: &str
  ) -> anyhow::Result<PathBuf> {
    Ok(Path::new(base_dir)
      .join("versions")
      .join(self.version_name.clone())
    )
  }

  /// ``EXAMPLE``\
  /// /home/test_user/.serenitymc/client/test_client/versions/Fabric 1.18.2/Fabric 1.18.2.jar
  pub fn get_jar(
    &self,
    base_dir: &str
  ) -> anyhow::Result<PathBuf> {
    let path = self.get_folder(base_dir)?
      .join(format!("{}.jar", self.version_name));

    path.try_exists()?;

    Ok(path)
  }

  // Возвращает путь до .json файла с информацией о версии (VersionData)\
  /// ``EXAMPLE``\
  /// /home/test_user/.serenitymc/client/test_client/versions/Fabric 1.18.2/Fabric 1.18.2.json
  pub fn get_data(
    &self,
    base_dir: &str
  ) -> anyhow::Result<PathBuf> {
    let path = self.get_folder(base_dir)?
      .join(format!("{}.json", self.version_name));

    path.try_exists()?;

    Ok(path)
  }

  pub fn open_data(
    &self,
    base_dir: &str
  ) -> anyhow::Result<VersionData> {
    let path = self.get_data(base_dir)?;

    Ok(mc_version_parser::parse(File::open(path)?)?)
  }
}

pub(crate) fn get_client_info(
  client_id: String
) -> anyhow::Result<ClientInfo> {
  let path = LauncherPaths::get_client_path(client_id)?;
  let config_path = Path::new(&path);
  let file = File::open(config_path.join(FILE))?;

  Ok(serde_json::from_reader::<File, ClientInfo>(file)?)
}