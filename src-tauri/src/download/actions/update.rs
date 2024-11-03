use serde::{Serialize, Deserialize};
use tauri::WebviewWindow;
use crate::{download::interface::DIAction, util::tauri::AnyhowResult};

use super::get_download_queue;

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct UpdateData {
  pub id: String,
  pub isPaused: bool,
}

impl DIAction for UpdateData {
  async fn handle(&self) -> AnyhowResult<()> {
    let queue = &mut *get_download_queue().lock().await;

    if self.isPaused {
      queue.pause(&self.id);
    } else {
      queue.set_current(self.id.clone());
      queue.start_current();
    }

    Ok(())
  }
}