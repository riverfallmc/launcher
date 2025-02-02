use reqwest::header;
use serde::{Serialize, Deserialize};
use crate::util::url::join_url;

#[derive(Serialize, Deserialize)]
struct TokenBody {
  token: String
}

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct SessionData {
  pub username: String,
  pub uuid: String,
  #[serde(rename="accessToken")]
  pub access_token: String
}

pub(crate) async fn request(
  jwt: String
) -> anyhow::Result<SessionData> {
  let bearer = format!("Bearer {jwt}");

  println!("{bearer}");

  let data = reqwest::Client::new()
    .post(join_url("api/session/login"))
    .header(header::AUTHORIZATION, bearer.clone())
    .json(&TokenBody {
      token: bearer
    })
    .send()
    .await?
    .error_for_status()?
    .json::<SessionData>()
    .await?;

  Ok(data)
}