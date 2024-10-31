use serde::{Serialize, Deserialize};
use tauri::WebviewWindow;
use crate::{download::interface::DIAction, util::tauri::AnyhowResult};

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct DeleteData {
  id: String,
}

impl DIAction for DeleteData {
  fn handle(&self, _window: WebviewWindow) -> AnyhowResult<()> {
    log::info!("Delete Data: {:?}", self);

    Ok(())
  }
}