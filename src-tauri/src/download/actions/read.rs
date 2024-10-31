use serde::{Serialize, Deserialize};
use tauri::WebviewWindow;
use crate::{download::interface::DIAction, util::tauri::AnyhowResult};

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct Status(String);

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct ReadData {
  id: String,
  name: String,
  speed: f32,
  progress: u8,
  status: Status
}

impl DIAction for ReadData {
  fn handle(&self, _window: WebviewWindow) -> AnyhowResult<()> {
    log::info!("Read Data: {:?}", self);

    Ok(())
  }
}