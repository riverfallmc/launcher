#![allow(non_snake_case, non_upper_case_globals, unused)]

use crate::util::tauri::AnyhowResult;
use super::actions::{create::CreateData, delete::DeleteData, read::ReadData, update::UpdateData};
use serde::{Deserialize, Serialize};
use tauri::WebviewWindow;
// DI - DownloadInterface

pub(crate) trait DIAction {
  fn handle(&self, window: WebviewWindow) -> AnyhowResult<()>;
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag="type", content="body")]
pub(crate) enum DIRequest {
  // Новое скачивание
  Create(CreateData),
  // Получение скачивания
  Read(ReadData),
  // Обновление скачивания (пауза)
  Update(UpdateData),
  // Удаление скачивания
  Delete(DeleteData)
}

// todo: make this more beauty
impl DIAction for DIRequest {
  fn handle(&self, window: WebviewWindow) -> AnyhowResult<()> {
    match self {
      DIRequest::Create(action) => action.handle(window),
      DIRequest::Read(action) => action.handle(window),
      DIRequest::Update(action) => action.handle(window),
      DIRequest::Delete(action) => action.handle(window),
    }
  }
}

#[tauri::command]
#[allow(unused, non_snake_case)]
pub(crate) fn downloadInterfaceCommand(
  window: WebviewWindow,
  request: DIRequest
) -> AnyhowResult<()> {
  request.handle(window)
}