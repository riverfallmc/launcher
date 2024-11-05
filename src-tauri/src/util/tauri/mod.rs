use std::path::Path;

use serde::Serialize;
use tauri::{ipc::InvokeError, Emitter, WebviewWindow};
use thiserror::Error;
use tokio::sync::Mutex;

use super::paths::LauncherPaths;

pub(crate) mod message;
pub(crate) mod userdata;

#[derive(Error, Debug)]
pub enum TauriCommandError {
  #[error("Anyhow error: {0}")]
  Anyhow(#[from] anyhow::Error),
}

impl From<TauriCommandError> for InvokeError {
  fn from(error: TauriCommandError) -> Self {
    InvokeError::from(error.to_string())
  }
}

#[allow(unused)]
pub(crate) type AnyhowResult<T> = anyhow::Result<T, TauriCommandError>;

// Дополнительные функции для Tauri

lazy_static::lazy_static! {
  pub(crate) static ref MAIN_WINDOW: Mutex<Option<WebviewWindow>> = Mutex::new(None);
}

/// Устанавливает main окно
pub(crate) async fn set_main_window(window: WebviewWindow) {
  let mut window_lock = MAIN_WINDOW.lock().await;
  *window_lock = Some(window);
}

/// Функция возвращает main окно
#[allow(unused)]
pub(crate) async fn get_main_window() -> anyhow::Result<WebviewWindow> {
  let window_option = MAIN_WINDOW
    .lock()
    .await;

  let window = window_option
    .clone()
    .ok_or_else(|| anyhow::anyhow!("Main window is not set"))?;

  Ok(window)
}

/// Является ли текущая сборка дебаг-версией?
#[tauri::command]
#[allow(non_snake_case)]
pub(crate) fn isDebug() -> bool {
  cfg!(debug_assertions)
}

/// Установлен ли клиент
#[tauri::command]
#[allow(non_snake_case)]
pub(crate) fn isClientInstalled(
  id: String
) -> AnyhowResult<bool> {
  let dir = format!("{}/{id}", LauncherPaths::get_client_dir()?);

  Ok(Path::new(&dir).is_dir())
}


#[allow(unused)]
pub(crate) async fn emit<T: Serialize + Clone>(event: &str, payload: T) -> anyhow::Result<()> {
  let window = get_main_window().await?;

  window.emit::<T>(event, payload)?;

  Ok(())
}