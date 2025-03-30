use crate::util::url::join_url;
use anyhow::anyhow;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct TokenBody {
    token: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct SessionData {
    #[serde(rename = "selectedProfile")]
    pub uuid: String,
    #[serde(rename = "accessToken")]
    pub access_token: String,
}

#[derive(Deserialize)]
struct ErrorResponse {
    message: String,
}

pub(crate) async fn request(_jwt: String, id: i32, username: &str) -> anyhow::Result<SessionData> {
    let res = reqwest::Client::new()
        .post(join_url(&format!(
            "api/session/login?id={id}&username={username}"
        )))
        // .json(&TokenBody { token: jwt })
        .send()
        .await?;
    // .error_for_status()?
    // .json::<SessionData>()
    // .await?;

    if !res.status().is_success() {
        let text = res.text().await?;

        return Err(anyhow!(
            serde_json::from_str::<ErrorResponse>(&text)
                .map_err(|_| anyhow!("{text}"))?
                .message
        ));
    }

    Ok(res.json::<SessionData>().await?)
}
