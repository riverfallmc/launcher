use serde::{Deserialize, Serialize};

/// Модуль, который парсит
/// файл ${папка клиента}/settings.json
/// который содержит в себе настройки клиента

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct ClientSettings {
  version_file: String,
}