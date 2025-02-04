use serde::{Serialize, Deserialize};
use crate::util::url::join_url;

#[derive(Serialize, Deserialize)]
struct TokenBody {
  token: String
}

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct SessionData {
  #[serde(rename="selectedProfile")]
  pub uuid: String,
  #[serde(rename="accessToken")]
  pub access_token: String
}

pub(crate) async fn request(
  jwt: String
) -> anyhow::Result<SessionData> {
  let data = reqwest::Client::new()
    .post(join_url("api/session/login"))
    .json(&TokenBody {
      token: jwt
    })
    .send()
    .await?
    .error_for_status()?
    .json::<SessionData>()
    .await?;

  Ok(data)
}