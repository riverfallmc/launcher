#![allow(non_snake_case, non_upper_case_globals, unused)]

/// DI => DownloadInterface

use crate::util::tauri::AnyhowResult;
use super::actions::{create::CreateData, delete::DeleteData, update::UpdateData};
use serde::{Deserialize, Serialize};
use tauri::WebviewWindow;

pub(crate) trait DIAction {
  async fn handle(&self) -> AnyhowResult<()>;
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag="type", content="body")]
pub(crate) enum DIRequest {
  // Новое скачивание
  Create(CreateData),
  // Обновление скачивания (пауза)
  Update(UpdateData),
  // Удаление скачивания
  Delete(DeleteData)
}

impl DIAction for DIRequest {
  async fn handle(&self) -> AnyhowResult<()> {
    match self {
      DIRequest::Create(action) => action.handle().await,
      DIRequest::Update(action) => action.handle().await,
      DIRequest::Delete(action) => action.handle().await,
    }
  }
}

#[tauri::command]
#[allow(unused, non_snake_case)]
/// download interface (di) comamnd (cmd) =< di_cmd
pub(crate) async fn di_cmd(
  request: DIRequest
) -> AnyhowResult<()> {
  request.handle().await
}