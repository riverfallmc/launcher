use serde::{Serialize, Deserialize};
use tauri::WebviewWindow;
use crate::{download::interface::DIAction, util::tauri::AnyhowResult};

use super::get_download_queue;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct DeleteData {
  pub id: String,
}

impl DIAction for DeleteData {
  async fn handle(&self) -> AnyhowResult<()> {
    let queue = &mut *get_download_queue().lock().await;
    queue.delete(&self.id);

    Ok(())
  }
}