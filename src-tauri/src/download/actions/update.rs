use serde::{Serialize, Deserialize};
use tauri::WebviewWindow;
use crate::{download::interface::DIAction, util::tauri::AnyhowResult};

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct UpdateData {
  pub id: String,
  pub isPaused: bool,
}

impl DIAction for UpdateData {
  // Todo
  async fn handle(&self) -> AnyhowResult<()> {
    log::info!("Update Data: {:?}", self);

    Ok(())
  }
}