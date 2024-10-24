use std::sync::Mutex;

use tauri::{ipc::InvokeError, WebviewWindow};
use thiserror::Error;

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
pub(crate) fn set_main_window(window: WebviewWindow) {
  let mut window_lock = MAIN_WINDOW.lock().unwrap();
  *window_lock = Some(window);
}

// Rust би лайк: ☹️
/// Функция возвращает main окно
#[allow(unused)]
pub(crate) fn get_main_window() -> anyhow::Result<WebviewWindow> {
  let window = MAIN_WINDOW
    .lock()
    .map_err(|e| anyhow::anyhow!("Unable to get window: {e}"))?
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