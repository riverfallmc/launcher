use serde::{Serialize, Deserialize};
use tauri::WebviewWindow;
use crate::{download::interface::DIAction, util::tauri::AnyhowResult};
use super::get_download_queue;

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct CreateData {
  id: String,
  name: String,
}

impl DIAction for CreateData {
  fn handle(&self, _window: WebviewWindow) -> AnyhowResult<()> {
    let queue = &mut *get_download_queue().lock().unwrap();

    queue.add(self.id.clone(), self.name.clone());

    Ok(())
  }
}