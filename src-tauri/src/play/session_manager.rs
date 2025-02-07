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

pub(crate) async fn request(jwt: String) -> anyhow::Result<SessionData> {
    let res = reqwest::Client::new()
        .post(join_url("api/session/login"))
        .json(&TokenBody { token: jwt })
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
