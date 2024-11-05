use reqwest::header;
use serde::{Serialize, Deserialize};

use crate::util::{tauri::userdata::get_user, url::join_url};

#[derive(Serialize, Deserialize)]
pub(crate) struct SessionData {
  pub username: String,
  pub uuid: String,
  pub token: String
}

pub(crate) async fn request() -> anyhow::Result<SessionData> {
  let user = get_user().await;

  let data = reqwest::Client::new().get(join_url("api/session/auth"))
    .header(header::CONTENT_TYPE, "application/json")
    .body(serde_json::json!(user).to_string())
    .send()
    .await?
    .json::<SessionData>()
    .await?;

  Ok(data)
}