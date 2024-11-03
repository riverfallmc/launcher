use serde::{Serialize, Deserialize};
use tauri::WebviewWindow;
use crate::{download::interface::DIAction, util::tauri::AnyhowResult};

use super::get_download_queue;

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct DeleteData {
  id: String,
}

impl DIAction for DeleteData {
  async fn handle(&self) -> AnyhowResult<()> {
    let queue = &mut *get_download_queue().lock().await;
    queue.remove(&self.id);

    Ok(())
  }
}