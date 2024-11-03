use serde::{Serialize, Deserialize};
use tauri::WebviewWindow;
use crate::{download::interface::DIAction, util::tauri::AnyhowResult};
use super::get_download_queue;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct CreateData {
  pub id: String,
  pub name: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct InstalledData {
  pub id: String,
  pub name: String
}

impl DIAction for CreateData {
  async fn handle(&self) -> AnyhowResult<()> {
    log::info!("handle create");
    let queue = &mut *get_download_queue().lock().await;
    queue.add(self.id.clone(), self.name.clone()).await;

    Ok(())
  }
}