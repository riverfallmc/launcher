use std::sync::Mutex;

use copypasta::{ClipboardContext, ClipboardProvider};
use tauri::{InvokeError, Manager, Window};
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
  pub(crate) static ref MAIN_WINDOW: Mutex<Option<Window>> = Mutex::new(None);
}

/// Устанавливает main окно
pub(crate) fn set_main_window(window: Window) {
  let mut window_lock = MAIN_WINDOW.lock().unwrap();
  *window_lock = Some(window);
}

// Rust би лайк: ☹️
/// Функция возвращает main окно
pub(crate) fn get_main_window() -> anyhow::Result<Window> {
  let window = MAIN_WINDOW
    .lock()
    .map_err(|e| anyhow::anyhow!("Unable to get window: {e}"))?
    .clone()
    .ok_or_else(|| anyhow::anyhow!("Main window is not set"))?;

  Ok(window)
}

/// Открывает ссылку в браузере
#[tauri::command]
#[allow(non_snake_case)]
pub(crate) fn openUrlInBrowser(
  url: String
) -> AnyhowResult<()> {
  let window = get_main_window()?;

  tauri::api::shell::open(&window.shell_scope(), url, None)
    .map_err(|e| anyhow::anyhow!("Failed to open URL in browser: {e}"))?;

  Ok(())
}

/// Является ли текущая сборка дебаг-версией?
#[tauri::command]
#[allow(non_snake_case)]
pub(crate) fn isDebug() -> bool {
  cfg!(debug_assertions)
}

/// Обновляет буфер обмена, устанавливая свой текст
#[tauri::command]
#[allow(non_snake_case)]
pub(crate) fn updateClipboard(
  text: String
) -> AnyhowResult<()> {
  let mut ctx = ClipboardContext::new()
    .map_err(|e| anyhow::anyhow!("Unable to create ClipboardContext: {e}"))?;

  ctx.set_contents(text)
    .map_err(|e| anyhow::anyhow!("Unable to update ClipboardContext: {e}"))?;

  Ok(())
}