use reqwest::header;
use serde::{Serialize, Deserialize};
use crate::util::{tauri::userdata::get_user, url::join_url};

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct SessionData {
  pub username: String,
  pub uuid: String,
  #[serde(rename="accessToken")]
  pub access_token: String
}

pub(crate) async fn request() -> anyhow::Result<SessionData> {
  let user = get_user().await;

  let bearer = format!("Bearer {}", user.jwt);

  log::info!("Token: {bearer}");

  let data = reqwest::Client::new()
    .post(join_url("api/session/login"))
    .header(header::AUTHORIZATION, bearer)
    .json("{}")
    .send().await?
    .error_for_status()?
    .json::<SessionData>().await?;

  Ok(data)
}